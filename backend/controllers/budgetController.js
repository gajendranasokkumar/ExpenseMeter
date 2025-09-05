const budgetService = require('../services/budgetService');

class BudgetController {
  async getBudgetById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'id is required' });
      }
      const budget = await budgetService.getBudgetById(id);
      return res.status(200).json(budget);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getBudgetsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const { page, limit } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      const result = await budgetService.getBudgetsByUserId(userId, { page, limit });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getBudgetsByUserIdAndCategoryForCurrentMonth(req, res) {
    try {
      const { userId, category, currentMonth } = req.params;
      const result = await budgetService.getBudgetsByUserIdAndCategoryForCurrentMonth(userId, category, currentMonth);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getBudgetsAndExpensesByCategoryForMonthAndYear(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      const { month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({ message: 'month and year are required' });
      }
      const result = await budgetService.getBudgetsAndExpensesByCategoryForMonthAndYear(userId, month, year);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async createMonthlyBudgetAsPrevious(req, res) {
    try {
      const { userId, month } = req.params;
      if (!userId || !month) {
        return res.status(400).json({ message: 'userId and month are required' });
      }
      const result = await budgetService.createMonthlyBudgetAsPrevious(userId, month);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async createBudget(req, res) {
    try {
      const { title, amount, category, user_id, period, start_date, end_date, isAllCategory = false } = req.body;
      if (!title || user_id === undefined || !category || amount === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'start_date and end_date are required' });
      }
      if (typeof amount !== 'number' || Number.isNaN(amount)) {
        return res.status(400).json({ message: 'amount must be a number' });
      }
      if (amount < 0) {
        return res.status(400).json({ message: 'amount must be positive' });
      }
      const budget = await budgetService.createBudget({ 
        title, 
        amount, 
        category, 
        user_id, 
        period: period || 'monthly',
        start_date, 
        end_date,
        isAllCategory
      });
      return res.status(201).json(budget);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateBudget(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id) {
        return res.status(400).json({ message: 'id is required' });
      }
      const budget = await budgetService.updateBudget(id, updateData);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
      return res.status(200).json(budget);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deleteBudget(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'id is required' });
      }
      const deleted = await budgetService.deleteBudget(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Budget not found' });
      }
      return res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deleteAllBudgetsByUserId(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      const result = await budgetService.deleteAllBudgetsByUserId(userId);
      return res.status(200).json({ message: 'All budgets deleted', deletedCount: result.deletedCount || 0 });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getActiveBudgetsByUserId(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      const budgets = await budgetService.getActiveBudgetsByUserId(userId);
      return res.status(200).json(budgets);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getBudgetSummaryByUserId(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      const summary = await budgetService.getBudgetSummaryByUserId(userId);
      return res.status(200).json(summary);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new BudgetController();
