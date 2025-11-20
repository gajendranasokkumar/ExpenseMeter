const mongoose = require('mongoose');
const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const Bank = require('../models/Bank.model');
const Category = require('../models/Category.model');
const transactionService = require('./transactionService');
const statisticsService = require('./statisticsService');
const budgetService = require('./budgetService');

const normalizeDoc = (doc = {}) => {
  if (!doc || typeof doc !== 'object') {
    return doc;
  }
  return {
    ...doc,
    id: doc._id ? String(doc._id) : undefined,
  };
};

const mapTransactions = (transactions = []) =>
  transactions.map((tx) => {
    const bank = normalizeBank(tx.bank);

    const category =
      tx.category_id && typeof tx.category_id === 'object'
        ? {
            id: tx.category_id._id ? String(tx.category_id._id) : undefined,
            name: tx.category_id.name,
            icon: tx.category_id.icon,
            color: tx.category_id.color,
          }
        : tx.category
        ? {
            id: tx.category_id ? String(tx.category_id) : undefined,
            name: tx.category,
          }
        : null;

    return {
      id: tx._id ? String(tx._id) : undefined,
      title: tx.title,
      amount: tx.amount,
      date: tx.date,
      category,
      bank,
      created_at: tx.created_at,
      updated_at: tx.updated_at,
    };
  });

const normalizeBank = (bankDoc) =>
  bankDoc && typeof bankDoc === 'object'
    ? {
        id: bankDoc._id ? String(bankDoc._id) : undefined,
        name: bankDoc.name,
        ifsc: bankDoc.ifsc,
        logo: bankDoc.logo,
      }
    : null;

const mapBudgets = (budgets = [], transactions = [], categories = []) =>
  budgets.map((budget) => {
    const { spent, periodTransactions } = computeBudgetUsage(
      budget,
      transactions
    );
    const categoryRef =
      budget.category_id && typeof budget.category_id === 'object'
        ? {
            id: String(budget.category_id._id),
            name: budget.category_id.name,
            icon: budget.category_id.icon,
            color: budget.category_id.color,
          }
        : (() => {
            if (!budget.category_id) return null;
            const match = categories.find(
              (cat) => String(cat._id) === String(budget.category_id)
            );
            if (!match) return null;
            return {
              id: String(match._id),
              name: match.name,
              icon: match.icon,
              color: match.color,
            };
          })();

    return {
      id: budget._id ? String(budget._id) : undefined,
      title: budget.title,
      amount: budget.amount,
      category: budget.category,
      category_ref: categoryRef,
      period: budget.period,
      start_date: budget.start_date,
      end_date: budget.end_date,
      is_active: budget.is_active,
      created_at: budget.created_at,
      updated_at: budget.updated_at,
      spent: budget.amountSpent ?? spent,
      period_transactions: periodTransactions,
    };
  });

const computeBudgetUsage = (budget, transactions) => {
  if (!budget) {
    return { spent: 0, periodTransactions: [] };
  }
  const isMonthlyBudget =
    typeof budget.category === 'string' &&
    budget.category.toLowerCase().startsWith('budget for ');

  let start = budget.start_date ? new Date(budget.start_date) : null;
  let end = budget.end_date ? new Date(budget.end_date) : null;

  if (isMonthlyBudget) {
    const reference = start || new Date();
    start = new Date(reference.getFullYear(), reference.getMonth(), 1, 0, 0, 0, 0);
    end = new Date(reference.getFullYear(), reference.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (end) {
    end.setHours(23, 59, 59, 999);
  }

  const periodTransactions = [];
  for (const tx of transactions) {
    if (!tx?.date) continue;
    const txDate = new Date(tx.date);
    if (start && txDate < start) continue;
    if (end && txDate > end) continue;

    let matchesCategory = false;
    if (isMonthlyBudget) {
      matchesCategory = true;
    } else if (budget.category_id) {
      matchesCategory =
        tx.category_id &&
        String(
          typeof tx.category_id === 'object'
            ? tx.category_id._id || tx.category_id
            : tx.category_id
        ) === String(budget.category_id._id || budget.category_id);
    } else {
      matchesCategory = tx.category === budget.category;
    }

    if (!matchesCategory) continue;

    if (typeof tx.amount !== 'number' || tx.amount >= 0) continue;

    periodTransactions.push({
      id: tx._id ? String(tx._id) : undefined,
      title: tx.title,
      amount: tx.amount,
      date: tx.date,
      bank: normalizeBank(tx.bank),
    });
  }

  const spent = periodTransactions.reduce((sum, tx) => {
    if (typeof tx.amount !== 'number') {
      return sum;
    }
    const absolute = tx.amount < 0 ? Math.abs(tx.amount) : 0;
    return sum + absolute;
  }, 0);

  return { spent, periodTransactions };
};

const mapBanks = (banks = []) =>
  banks.map((bank) => ({
    id: bank._id ? String(bank._id) : undefined,
    name: bank.name,
    ifsc: bank.ifsc,
    logo: bank.logo,
    isActive: bank.isActive,
    createdAt: bank.createdAt,
    updatedAt: bank.updatedAt,
  }));

const mapCategories = (categories = []) =>
  categories.map((category) => ({
    id: category._id ? String(category._id) : undefined,
    name: category.name,
    icon: category.icon,
    color: category.color,
    isActive: category.isActive,
    created_at: category.created_at,
    updated_at: category.updated_at,
  }));

const exportUserData = async (userId) => {
  if (!userId) {
    throw new Error('userId is required');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid userId');
  }

  const user = await User.findById(userId).select('-password').lean();
  if (!user) {
    throw new Error('User not found');
  }

  const [
    transactions,
    budgetsResult,
    banks,
    categories,
    summary,
    totalStats,
  ] = await Promise.all([
    Transaction.find({ user_id: userId })
      .sort({ date: -1, created_at: -1 })
      .populate('bank', 'name ifsc logo')
      .populate('category_id', 'name icon color')
      .lean(),
    budgetService
      .getBudgetsByUserId(userId, { page: 1, limit: 1000 })
      .then((result) => result.items || []),
    Bank.find({ user_id: userId }).sort({ createdAt: -1 }).lean(),
    Category.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
    transactionService.getSummaryByUserId(userId),
    statisticsService.getTotalStats(userId),
  ]);
  const budgets = budgetsResult || [];

  return {
    user: normalizeDoc(user),
    summary,
    stats: totalStats,
    counts: {
      transactions: transactions.length,
      budgets: budgets.length,
      banks: banks.length,
      categories: categories.length,
    },
    transactions: mapTransactions(transactions),
    budgets: mapBudgets(budgets, transactions, categories),
    banks: mapBanks(banks),
    categories: mapCategories(categories),
    generatedAt: new Date().toISOString(),
  };
};

module.exports = {
  exportUserData,
};


