const TransactionModel = require("../models/Transaction.model");
const budgetService = require("../services/budgetService");

exports.getDailyStats = async (userId, day, month, year) => {
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  const transactions = await TransactionModel.find({
    user_id: userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  }).lean();

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpense = {};

  for (const tx of transactions) {
    if (tx.amount > 0) {
      totalIncome += tx.amount;
    } else if (tx.amount < 0) {
      totalExpense += Math.abs(tx.amount);
      if (!categoryExpense[tx.category]) {
        categoryExpense[tx.category] = 0;
      }
      categoryExpense[tx.category] += Math.abs(tx.amount);
    }
  }

  return {
    totalIncome,
    totalExpense,
    categoryExpense
  };
};

exports.getMonthlySummary = async (userId, month, year) => {
  const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const budgetsOfTheMonth = await budgetService.getBudgetsByUserId(userId, { page: 1, limit: 10000, startDate: startOfMonth, endDate: endOfMonth});
  const pieChartData = await getStatsForRange(userId, startOfMonth, endOfMonth);

  const transactions = await TransactionModel.find({
    user_id: userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).lean();

  const summary = {};
  for (const tx of transactions) {
    const dateStr = tx.date.toISOString().slice(0, 10);
    if (!summary[dateStr]) {
      summary[dateStr] = { income: 0, expense: 0 };
    }
    if (tx.amount > 0) {
      summary[dateStr].income += tx.amount;
    } else if (tx.amount < 0) {
      summary[dateStr].expense += Math.abs(tx.amount);
    }
  }
  return { summary, budgetsOfTheMonth, pieChartData };
};

const getStatsForRange = async (userId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const transactions = await TransactionModel.find({
    user_id: userId,
    date: { $gte: start, $lte: end },
  }).lean();

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpense = {};

  for (const tx of transactions) {
    if (tx.amount > 0) {
      totalIncome += tx.amount;
    } else if (tx.amount < 0) {
      totalExpense += Math.abs(tx.amount);
      if (!categoryExpense[tx.category]) {
        categoryExpense[tx.category] = 0;
      }
      categoryExpense[tx.category] += Math.abs(tx.amount);
    }
  }

  return {
    totalIncome,
    totalExpense,
    categoryExpense
  };
};