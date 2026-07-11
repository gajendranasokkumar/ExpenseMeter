const Transaction = require('../models/Transaction.model');
const NotificationService = require('./notificationService');
const Bank = require('../models/Bank.model');
// let summarycount = 0;
// let tracscount = 0;

const getTransactionsByUserId = async (userId, { page = 1, limit = 10, startDate, endDate } = {}) => {
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const filter = { user_id: userId };
  if (startDate || endDate) {
    const dateFilter = {};
    if (startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) {
        dateFilter.$gte = d;
      }
    }
    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    }
    if (dateFilter.$gte || dateFilter.$lte) {
      filter.date = dateFilter;
    }
  }
  // console.log("comming transactions ", tracscount++);

  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ date: -1, created_at: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;
  return { items, total, page: pageNumber, limit: pageSize, totalPages };
};

const createTransaction = async ({ title, amount, category, category_id, bank, user_id, date }) => {
  const transactionData = { title, amount, category, bank, user_id, date };
  
  // If category_id is provided (custom category), set it
  if (category_id) {
    transactionData.category_id = category_id;
    // Store category name as well for backward compatibility
    transactionData.category = category || category_id;
  } else {
    // For default categories, category is a string
    transactionData.category = category;
  }
  
  const transaction = await Transaction.create(transactionData);
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
    { $match: { user_id: typeof userId === 'string' ? new (require('mongoose').Types.ObjectId)(userId) : userId, category: { $ne: 'Transfer' } } },
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

const transferBetweenBanks = async ({ user_id, fromBank, toBank, amount, date, note }) => {
  if (!user_id || !fromBank || !toBank || amount === undefined) {
    throw new Error('user_id, fromBank, toBank and amount are required');
  }
  if (String(fromBank) === String(toBank)) {
    throw new Error('Source and destination banks must be different');
  }
  const transferAmount = Math.abs(Number(amount));
  if (!transferAmount || Number.isNaN(transferAmount)) {
    throw new Error('Amount must be a positive number');
  }

  const [from, to] = await Promise.all([Bank.findById(fromBank), Bank.findById(toBank)]);
  if (!from || !to) {
    throw new Error('Bank not found');
  }

  // Ensure the source bank has enough available balance.
  const fromTransactions = await Transaction.find({ user_id, bank: fromBank }).select('amount').lean();
  const available = fromTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  if (transferAmount > available) {
    throw new Error('Insufficient balance in the source bank');
  }

  const txDate = date ? new Date(date) : new Date();

  const outgoing = await Transaction.create({
    user_id,
    title: note || `Transfer to ${to.name}`,
    amount: -transferAmount,
    category: 'Transfer',
    bank: fromBank,
    date: txDate,
  });
  const incoming = await Transaction.create({
    user_id,
    title: note || `Transfer from ${from.name}`,
    amount: transferAmount,
    category: 'Transfer',
    bank: toBank,
    date: txDate,
  });

  await NotificationService.createNotification({
    user_id,
    title: 'Bank Transfer',
    message: `Transferred ${transferAmount} from ${from.name} to ${to.name}`,
  });

  return { outgoing, incoming };
};

module.exports = {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  deleteAllTransactionsByUserId,
  getSummaryByUserId,
  transferBetweenBanks,
};
