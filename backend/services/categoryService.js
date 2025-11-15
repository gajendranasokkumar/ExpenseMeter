const categoryModel = require('../models/Category.model');
const mongoose = require('mongoose');

const createCategory = async ({ name, icon, color, user_id }) => {
  if (!name || !user_id) {
    throw new Error('Name and user_id are required');
  }

  // Convert userId to ObjectId if it's a string
  const userIdObj = typeof user_id === 'string' ? new mongoose.Types.ObjectId(user_id) : user_id;

  // Check if category already exists for this user
  const existingCategory = await categoryModel.findOne({ 
    user_id: userIdObj, 
    name: { $regex: new RegExp(`^${name}$`, 'i') } 
  });
  if (existingCategory) {
    throw new Error('Category already exists with this name');
  }

  const category = await categoryModel.create({ 
    name, 
    icon, 
    color, 
    user_id: userIdObj 
  });
  return category;
};

const getAllCategories = async (userId) => {
  // Convert userId to ObjectId if it's a string
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  
  const categories = await categoryModel.find({ 
    user_id: userIdObj, 
    isActive: true 
  }).sort({ name: 1 }).lean();
  return categories;
};

const getCategoryById = async (id, userId) => {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const category = await categoryModel.findOne({ 
    _id: id, 
    user_id: userIdObj 
  }).lean();
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const updateCategoryById = async (id, userId, updateData) => {
  const { name, icon, color, isActive } = updateData;
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  // If name is being updated, check for duplicates
  if (name) {
    const existingCategory = await categoryModel.findOne({ 
      _id: { $ne: id },
      user_id: userIdObj, 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    if (existingCategory) {
      throw new Error('Another category already exists with this name');
    }
  }

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (icon !== undefined) updateFields.icon = icon;
  if (color !== undefined) updateFields.color = color;
  if (isActive !== undefined) updateFields.isActive = isActive;

  const category = await categoryModel.findByIdAndUpdate(
    id,
    { ...updateFields, updatedAt: Date.now() },
    { new: true }
  );

  if (!category || category.user_id.toString() !== userIdObj.toString()) {
    throw new Error('Category not found');
  }

  return category;
};

const deleteCategoryById = async (id, userId) => {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const category = await categoryModel.findByIdAndUpdate(
    id,
    { isActive: false, updatedAt: Date.now() },
    { new: true }
  );

  if (!category || category.user_id.toString() !== userIdObj.toString()) {
    throw new Error('Category not found');
  }

  return category;
};

const permanentlyDeleteCategoryById = async (id, userId) => {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const category = await categoryModel.findOneAndDelete({ 
    _id: id, 
    user_id: userIdObj 
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

const getAllCategoriesIncludingInactive = async (userId) => {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const categories = await categoryModel.find({ 
    user_id: userIdObj 
  }).sort({ name: 1 }).lean();
  return categories;
};

const getCategorySummaryByUserId = async (userId) => {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const categories = await categoryModel.find({ user_id: userIdObj });
  const activeCount = categories.filter(cat => cat.isActive).length;
  const inactiveCount = categories.filter(cat => !cat.isActive).length;

  return {
    total: categories.length,
    active: activeCount,
    inactive: inactiveCount,
    categories: categories
  };
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  permanentlyDeleteCategoryById,
  getAllCategoriesIncludingInactive,
  getCategorySummaryByUserId,
};

