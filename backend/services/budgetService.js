const Budget = require('../models/Budget.model');
const NotificationService = require('./notificationService');
const Transaction = require('../models/Transaction.model');
const { getCurrentMonth, getPreviousMonth, getMonthIndex } = require('../utils/fomatDates');

const getBudgetById = async (id) => {
  const budget = await Budget.findById(id).lean();
  if (!budget) {
    throw new Error('Budget not found');
  }
  return budget;
};

const getBudgetsByUserId = async (userId, { page = 1, limit = 10, startDate, endDate } = {}) => {
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 1000);
  const filter = { user_id: userId };
  let filterStart = null;
  let filterEnd = null;
  if (startDate || endDate) {

    if (startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) {
        filterStart = d;
      }
    }
    if (endDate) {
      const d = new Date(endDate);
      if (!isNaN(d.getTime())) {
        d.setHours(23, 59, 59, 999);
        filterEnd = d;
      }
    }

    if (filterStart && filterEnd) {
      // Contained within selected window
      filter.$and = [
        { start_date: { $gte: filterStart } },
        { end_date: { $lte: filterEnd } },
      ];
    } else if (filterStart) {
      // Budgets starting on/after the start filter
      filter.start_date = { $gte: filterStart };
    } else if (filterEnd) {
      // Budgets ending on/before the end filter
      filter.end_date = { $lte: filterEnd };
    }
  }

  const [items, total] = await Promise.all([
    Budget.find(filter)
      .sort({ start_date: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Budget.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;
  // Compute amount spent per budget using each budget's own date range
  let itemsWithSpend = items;
  if (items.length > 0) {
    const minStart = new Date(Math.min(...items.map(b => new Date(b.start_date).getTime())));
    const maxEnd = new Date(Math.max(...items.map(b => new Date(b.end_date).getTime())));

    const transactions = await Transaction.find({
      user_id: userId,
      amount: { $lt: 0 },
      date: { $gte: minStart, $lte: maxEnd }
    }).select('amount category date').lean();

    const transactionsByCategory = transactions.reduce((acc, tx) => {
      const key = tx.category;
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(tx);
      return acc;
    }, {});

    itemsWithSpend = items.map(b => {
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);

      if (b.category === 'Monthly Budget') {
        // Sum all expenses across all categories within the budget window
        const spentAll = transactions.reduce((sum, tx) => {
          const d = new Date(tx.date);
          if (d >= start && d <= end) {
            return sum + Math.abs(tx.amount || 0);
          }
          return sum;
        }, 0);
        return { ...b, amountSpent: spentAll };
      }

      // Sum only this budget's category within the budget window
      const categoryTxs = transactionsByCategory[b.category] || [];
      const spentCategory = categoryTxs.reduce((sum, tx) => {
        const d = new Date(tx.date);
        if (d >= start && d <= end) {
          return sum + Math.abs(tx.amount || 0);
        }
        return sum;
      }, 0);
      return { ...b, amountSpent: spentCategory };
    });
  }

  return { items: itemsWithSpend, total, page: pageNumber, limit: pageSize, totalPages };
};

const getBudgetsByUserIdAndCategoryForCurrentMonth = async (userId, category, currentMonth) => {
  const filter = { user_id: userId, category, title: `Budget for ${currentMonth}`};
  const budgets = await Budget.find(filter).lean();
  if(budgets.length === 0) {
    throw new Error('No budget found for this month');
  }
  
  const budget = budgets[0];

  const matchingTransactions = await Transaction.find({
    user_id: userId,
    date: { 
      $gte: budget.start_date, 
      $lte: budget.end_date 
    },
    amount: { $lt: 0 }
  }).lean();
    
  const totalAmountSpent = matchingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return { 
    ...budget, 
    totalAmountSpentonThisMonth: totalAmountSpent * -1 
  };
};

const createMonthlyBudgetAsPrevious = async (userId, month) => {

  const lastMonth = getPreviousMonth(month);
  const currentMonthIndex = getMonthIndex(month);

  const lastMonthBudget = await Budget.findOne({ 
    user_id: userId, 
    title: `Budget for ${lastMonth}`, 
  }).lean();
  
  if (lastMonthBudget) {
    await Budget.create({
      user_id: userId,
      title: `Budget for ${month}`,
      category: lastMonthBudget.category,
      amount: lastMonthBudget.amount,
      start_date: new Date(new Date().getFullYear(), currentMonthIndex, 1),
      end_date: new Date(new Date().getFullYear(), currentMonthIndex + 1, 0),
    });
    return lastMonthBudget;
  }
  throw new Error('No budget found for the previous month');
};

const getBudgetsAndExpensesByCategoryForMonthAndYear = async (userId, month, year) => {
  const currentMonth = month;
  const currentYear = year;
  const currentMonthIndex = getMonthIndex(month);
  
  const monthStart = new Date(currentYear, currentMonthIndex, 1);
  const monthEnd = new Date(currentYear, currentMonthIndex + 1, 0, 23, 59, 59, 999);

  const budgets = await Budget.find({
    user_id: userId,
    start_date: { $gte: monthStart },
    end_date: { $lte: monthEnd }
  }).lean();

  const transactions = await Transaction.find({
    user_id: userId,
    date: { $gte: monthStart, $lte: monthEnd },
    amount: { $lt: 0 }
  }).lean();

  const expensesByCategory = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Math.abs(transaction.amount);
    return acc;
  }, {});

  const result = [];
  
  budgets.forEach(budget => {
    if (budget.category !== 'Monthly Budget' && budget.amount > 0) {
      const categoryExpenses = expensesByCategory[budget.category] || 0;
      result.push({
        // budget: budget,
        category: budget.category,
        budgetAmount: budget.amount,
        totalExpenses: categoryExpenses,
        remainingBudget: budget.amount - categoryExpenses,
        percentageUsed: budget.amount > 0 ? Math.round((categoryExpenses / budget.amount) * 100) : 0
      });
    }
  });

  return {
    month: currentMonth,
    year: currentYear,
    monthStart,
    monthEnd,
    categories: result.sort((a, b) => a.category.localeCompare(b.category))
  };
};

const createBudget = async ({ title, amount, category, category_id, user_id, period, start_date, end_date, isAllCategory }) => {

  const month = new Date(start_date).toLocaleString('en-US', { month: 'long' });

  if (isAllCategory) {
    const budgets = await Budget.find({ user_id: user_id, title: `Budget for ${month}`, start_date, end_date }).lean();
    if (budgets.length > 0) {
      throw new Error('You already have a budget for this month');
      return;
    }
  }

  const budgetData = { 
    title, 
    amount, 
    category, 
    user_id, 
    period, 
    start_date, 
    end_date,
    isAllCategory
  };

  // If category_id is provided (custom category), set it
  if (category_id) {
    budgetData.category_id = category_id;
    // Store category name as well for backward compatibility
    budgetData.category = category || category_id;
  } else {
    // For default categories, category is a string
    budgetData.category = category;
  }

  const budget = await Budget.create(budgetData);
  
  await NotificationService.createNotification({ 
    user_id, 
    title: 'Budget Created', 
    message: `Budget "${title}" created with amount ${amount} for ${period} period ${isAllCategory ? 'for this month' : 'for ' + category}` 
  });
  
  return budget;
};

const updateBudget = async (id, updateData) => {
  const budget = await Budget.findByIdAndUpdate(id, updateData, { new: true });
  
  if (budget) {
    await NotificationService.createNotification({ 
      user_id: budget.user_id, 
      title: 'Budget Updated', 
      message: `Budget "${budget.title}" has been updated` 
    });
  }
  
  return budget;
};

const deleteBudget = async (id) => {
  const deleted = await Budget.findByIdAndDelete(id);
  
  if (deleted) {
    await NotificationService.createNotification({ 
      user_id: deleted.user_id, 
      title: 'Budget Deleted', 
      message: `Budget "${deleted.title}" deleted with amount ${deleted.amount}` 
    });
  }
  
  return deleted;
};

const deleteAllBudgetsByUserId = async (userId) => {
  const result = await Budget.deleteMany({ user_id: userId });
  
  await NotificationService.createNotification({ 
    user_id: userId, 
    title: 'All Budgets Deleted', 
    message: `All budgets deleted` 
  });
  
  return result;
};

const getActiveBudgetsByUserId = async (userId) => {
  const budgets = await Budget.find({ 
    user_id: userId, 
    is_active: true 
  })
    .sort({ start_date: -1 })
    .lean();
  
  return budgets;
};

const getBudgetSummaryByUserId = async (userId) => {
  const result = await Budget.aggregate([
    { $match: { user_id: typeof userId === 'string' ? new (require('mongoose').Types.ObjectId)(userId) : userId } },
    {
      $group: {
        _id: null,
        total_budget_amount: { $sum: '$amount' },
        active_budget_amount: { 
          $sum: { 
            $cond: [{ $eq: ['$is_active', true] }, '$amount', 0] 
          } 
        },
        total_budgets: { $sum: 1 },
        active_budgets: { 
          $sum: { 
            $cond: [{ $eq: ['$is_active', true] }, 1, 0] 
          } 
        },
        budgets_by_period: {
          $push: {
            period: '$period',
            amount: '$amount',
            is_active: '$is_active'
          }
        }
      },
    },
  ]);

  const summary = result[0] || { 
    total_budget_amount: 0, 
    active_budget_amount: 0, 
    total_budgets: 0, 
    active_budgets: 0,
    budgets_by_period: []
  };

  // Group budgets by period
  const periodSummary = {};
  summary.budgets_by_period.forEach(budget => {
    if (!periodSummary[budget.period]) {
      periodSummary[budget.period] = { total: 0, active: 0, count: 0, active_count: 0 };
    }
    periodSummary[budget.period].total += budget.amount;
    periodSummary[budget.period].count += 1;
    if (budget.is_active) {
      periodSummary[budget.period].active += budget.amount;
      periodSummary[budget.period].active_count += 1;
    }
  });

  return {
    total_budget_amount: summary.total_budget_amount || 0,
    active_budget_amount: summary.active_budget_amount || 0,
    total_budgets: summary.total_budgets || 0,
    active_budgets: summary.active_budgets || 0,
    period_summary: periodSummary
  };
};

module.exports = {
  getBudgetById,
  getBudgetsByUserId,
  getBudgetsByUserIdAndCategoryForCurrentMonth,
  getBudgetsAndExpensesByCategoryForMonthAndYear,
  createBudget,
  updateBudget,
  deleteBudget,
  deleteAllBudgetsByUserId,
  getActiveBudgetsByUserId,
  getBudgetSummaryByUserId,
  createMonthlyBudgetAsPrevious,
};
