const transactionService = require('../services/transactionService');

class TransactionController {
  async getTransactionsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const { page, limit } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      const result = await transactionService.getTransactionsByUserId(userId, { page, limit });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async createTransaction(req, res) {
    try {
      const { title, amount, category, user_id } = req.body;
      if (!title || user_id === undefined || !category || amount === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      if (typeof amount !== 'number' || Number.isNaN(amount)) {
        return res.status(400).json({ message: 'amount must be a number' });
      }
      const transaction = await transactionService.createTransaction({ title, amount, category, user_id });
      return res.status(201).json(transaction);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deleteTransaction(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'id is required' });
      }
      const deleted = await transactionService.deleteTransaction(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      return res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deleteAllTransactionsByUserId(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      const result = await transactionService.deleteAllTransactionsByUserId(userId);
      return res.status(200).json({ message: 'All transactions deleted', deletedCount: result.deletedCount || 0 });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getSummaryByUserId(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      const summary = await transactionService.getSummaryByUserId(userId);
      return res.status(200).json(summary);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new TransactionController();


