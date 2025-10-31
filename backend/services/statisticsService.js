const TransactionModel = require("../models/Transaction.model");
const budgetService = require("../services/budgetService");
const BankModel = require("../models/Bank.model");

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

exports.getTotalStats = async (userId) => {
  // Find earliest and latest transaction dates for the user
  const rangeAgg = await TransactionModel.aggregate([
    { $match: { user_id: typeof userId === 'string' ? new (require('mongoose').Types.ObjectId)(userId) : userId } },
    { $group: { _id: null, minDate: { $min: "$date" }, maxDate: { $max: "$date" } } },
  ]);

  const now = new Date();
  const startDate = rangeAgg?.[0]?.minDate ? new Date(rangeAgg[0].minDate) : new Date(now.getFullYear(), 0, 1);
  const endDate = now;

  const { totalIncome, totalExpense, categoryExpense } = await getStatsForRange(userId, startDate, endDate);

  // Top 5 categories by expense
  const topCategories = Object.entries(categoryExpense)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Compute yearly income/expense to find top years
  const yearlyAgg = await TransactionModel.aggregate([
    { $match: { user_id: typeof userId === 'string' ? new (require('mongoose').Types.ObjectId)(userId) : userId, date: { $gte: startDate, $lte: endDate } } },
    { $project: { year: { $year: "$date" }, amount: 1 } },
    {
      $group: {
        _id: "$year",
        income: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
        expense: { $sum: { $cond: [{ $lt: ["$amount", 0] }, { $abs: "$amount" }, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const bestIncomeYear = yearlyAgg.length
    ? yearlyAgg.slice().sort((a, b) => b.income - a.income)[0]
    : null;
  const highestExpenseYear = yearlyAgg.length
    ? yearlyAgg.slice().sort((a, b) => b.expense - a.expense)[0]
    : null;

  // Most used bank account by count of transactions
  const bankAgg = await TransactionModel.aggregate([
    { $match: { user_id: typeof userId === 'string' ? new (require('mongoose').Types.ObjectId)(userId) : userId, date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: "$bank", usage: { $sum: 1 } } },
    { $sort: { usage: -1 } },
    { $limit: 1 },
  ]);

  let mostUsedBank = null;
  if (bankAgg.length && bankAgg[0]?._id) {
    const bankDoc = await BankModel.findById(bankAgg[0]._id).lean();
    if (bankDoc) {
      mostUsedBank = {
        id: String(bankDoc._id),
        name: bankDoc.name,
        logo: bankDoc.logo,
        usage: bankAgg[0].usage,
      };
    } else {
      mostUsedBank = { id: String(bankAgg[0]._id), name: "Unknown", logo: "", usage: bankAgg[0].usage };
    }
  }

  return {
    range: { startDate, endDate },
    totals: { totalIncome, totalExpense, net: totalIncome - totalExpense },
    bestIncomeYear: bestIncomeYear ? { year: bestIncomeYear._id, income: bestIncomeYear.income } : null,
    highestExpenseYear: highestExpenseYear ? { year: highestExpenseYear._id, expense: highestExpenseYear.expense } : null,
    topCategories,
    mostUsedBank,
  };
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