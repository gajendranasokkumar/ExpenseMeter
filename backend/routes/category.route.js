const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken');
const categoryController = require('../controllers/categoryController');

router.use(verifyToken);

// POST /categories/all - Get all categories for user (body: { userId })
router.post('/all', categoryController.getAllCategories);

// GET /categories/user/:userId - Get all categories for user
router.get('/user/:userId', categoryController.getAllCategories);

// GET /categories/user/:userId/all - Get all categories including inactive
router.get('/user/:userId/all', categoryController.getAllCategoriesIncludingInactive);

// POST /categories - Create new category
router.post('/', categoryController.createCategory);

// GET /categories/:id/user/:userId - Get category by ID
router.get('/:id/user/:userId', categoryController.getCategoryById);

// PUT /categories/:id - Update category
router.put('/:id', categoryController.updateCategoryById);

// DELETE /categories/:id/user/:userId - Deactivate category
router.delete('/:id/user/:userId', categoryController.deleteCategoryById);

// DELETE /categories/permanent/:id/user/:userId - Permanently delete category
router.delete('/permanent/:id/user/:userId', categoryController.permanentlyDeleteCategoryById);

// GET /categories/summary/:userId - Get category summary
router.get('/summary/:userId', categoryController.getCategorySummaryByUserId);

module.exports = router;

