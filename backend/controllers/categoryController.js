const categoryService = require('../services/categoryService');

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name, icon, color, user_id } = req.body;
      if (!name || !user_id) {
        return res.status(400).json({ message: 'Name and user_id are required' });
      }
      const category = await categoryService.createCategory({ name, icon, color, user_id });
      return res.status(201).json({
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      const userId = req.params.userId || req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const categories = await categoryService.getAllCategories(userId);
      return res.status(200).json({
        message: 'Categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      return res.status(400).json({ 
        message: error.message || 'Unable to load categories',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async getAllCategoriesIncludingInactive(req, res) {
    try {
      const userId = req.params.userId || req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const categories = await categoryService.getAllCategoriesIncludingInactive(userId);
      return res.status(200).json({
        message: 'Categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.params.userId || req.body.userId;
      if (!id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const category = await categoryService.getCategoryById(id, userId);
      return res.status(200).json({
        message: 'Category retrieved successfully',
        data: category
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateCategoryById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.body.userId;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const category = await categoryService.updateCategoryById(id, userId, updateData);
      return res.status(200).json({
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deleteCategoryById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.params.userId || req.body.userId;
      if (!id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const category = await categoryService.deleteCategoryById(id, userId);
      return res.status(200).json({
        message: 'Category deactivated successfully',
        data: category
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async permanentlyDeleteCategoryById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.params.userId || req.body.userId;
      if (!id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const category = await categoryService.permanentlyDeleteCategoryById(id, userId);
      return res.status(200).json({
        message: 'Category permanently deleted successfully',
        data: category
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getCategorySummaryByUserId(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const summary = await categoryService.getCategorySummaryByUserId(userId);
      return res.status(200).json({
        message: 'Category summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();

