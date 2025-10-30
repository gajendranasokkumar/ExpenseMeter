const TransactionModel = require("../models/Transaction.model");

exports.getDailyStats = async (userId, day, month, year) => {
  // Create start and end dates for the specific day
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