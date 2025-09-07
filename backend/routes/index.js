const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const userRoutes = require('./user.route');
const transactionRoutes = require('./transaction.route');
const notificationRoutes = require('./notification.route');
const budgetRoutes = require('./budget.route');
const bankRoutes = require('./bank.route');

router.get('/', homeController.getHome);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/budgets', budgetRoutes);
router.use('/banks', bankRoutes);

module.exports = router;
        