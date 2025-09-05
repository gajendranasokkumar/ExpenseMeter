const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken');
const budgetController = require('../controllers/budgetController');

// All routes protected
router.use(verifyToken);

// GET /budgets/:id
router.get('/:id', budgetController.getBudgetById);

// GET /budgets/user/:userId
router.get('/user/:userId', budgetController.getBudgetsByUserId);

// GET /budgets/user/:userId/category/:category
router.get('/user/:userId/category/:category/currentMonth/:currentMonth', budgetController.getBudgetsByUserIdAndCategoryForCurrentMonth);

// GET /budgets/user/:userId/categories-summary
router.get('/user/:userId/categories-summary', budgetController.getBudgetsAndExpensesByCategoryForMonthAndYear);

// POST /budgets
router.post('/', budgetController.createBudget);

// PUT /budgets/:id
router.put('/:id', budgetController.updateBudget);

// DELETE /budgets/:id
router.delete('/:id', budgetController.deleteBudget);

// GET /budgets/active/:userId
router.get('/active/:userId', budgetController.getActiveBudgetsByUserId);

// GET /budgets/summary/:userId
router.get('/summary/:userId', budgetController.getBudgetSummaryByUserId);

// DELETE /budgets/user/:userId (delete all)
router.delete('/user/:userId', budgetController.deleteAllBudgetsByUserId);

// POST /budgets/user/:userId/month/:month
router.post('/user/:userId/month/:month', budgetController.createMonthlyBudgetAsPrevious);

module.exports = router;
