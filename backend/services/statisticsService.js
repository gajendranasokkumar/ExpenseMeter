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

exports.getYearlyStats = async (userId, year) => {
  const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

  const pieChartData = await getStatsForRange(userId, startOfYear, endOfYear);

  const transactions = await TransactionModel.find({
    user_id: userId,
    date: { $gte: startOfYear, $lte: endOfYear },
  }).lean();

  const months = Array.from({ length: 12 }, (_, idx) => ({
    month: idx + 1,
    income: 0,
    expense: 0,
  }));

  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    const monthIndex = new Date(tx.date).getMonth();
    if (tx.amount > 0) {
      months[monthIndex].income += tx.amount;
      totalIncome += tx.amount;
    } else if (tx.amount < 0) {
      const absAmt = Math.abs(tx.amount);
      months[monthIndex].expense += absAmt;
      totalExpense += absAmt;
    }
  }

  return {
    months,
    totalIncome,
    totalExpense,
    pieChartData
  };
}

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