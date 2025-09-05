const Transaction = require('../models/Transaction.model');
const NotificationService = require('./notificationService');
// let summarycount = 0;
// let tracscount = 0;

const getTransactionsByUserId = async (userId, { page = 1, limit = 10 } = {}) => {
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const filter = { user_id: userId };
  // console.log("comming transactions ", tracscount++);

  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ created_at: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;
  return { items, total, page: pageNumber, limit: pageSize, totalPages };
};

const createTransaction = async ({ title, amount, category, user_id, date }) => {
  const transaction = await Transaction.create({ title, amount, category, user_id, date });
  if(amount > 0) {
    await NotificationService.createNotification({ user_id, title: 'Income', message: `You have earned ${amount} from ${title}` });
  } else {
    await NotificationService.createNotification({ user_id, title: 'Expense', message: `You have spent ${amount} on ${title}` });
  }
  return transaction;
};

const deleteTransaction = async (id) => {
  const deleted = await Transaction.findByIdAndDelete(id);
  await NotificationService.createNotification({ user_id: deleted.user_id, title: 'Transaction Deleted', message: `Transaction ${deleted.title} deleted with amount ${deleted.amount}` });
  return deleted;
};

const deleteAllTransactionsByUserId = async (userId) => {
  const result = await Transaction.deleteMany({ user_id: userId });
  await NotificationService.createNotification({ user_id: userId, title: 'All Transactions Deleted', message: `All transactions deleted` });
  return result;
};

const getSummaryByUserId = async (userId) => {
  const result = await Transaction.aggregate([
    { $match: { user_id: typeof userId === 'string' ? new (require('mongoose').Types.ObjectId)(userId) : userId } },
    {
      $group: {
        _id: null,
        balance: { $sum: '$amount' },
        income: { $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] } },
        expenses: { $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] } },
      },
    },
  ]);
  // console.log("comming summary ", summarycount++);


  const summary = result[0] || { balance: 0, income: 0, expenses: 0 };
  return { balance: summary.balance || 0, income: summary.income || 0, expenses: summary.expenses || 0 };
};

module.exports = {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  deleteAllTransactionsByUserId,
  getSummaryByUserId,
};


