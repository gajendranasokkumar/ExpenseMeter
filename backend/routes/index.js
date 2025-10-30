const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const userRoutes = require('./user.route');
const transactionRoutes = require('./transaction.route');
const notificationRoutes = require('./notification.route');
const budgetRoutes = require('./budget.route');
const bankRoutes = require('./bank.route');
const statisticsRoute = require('./statistics.route');

router.get('/', homeController.getHome);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/budgets', budgetRoutes);
router.use('/banks', bankRoutes);
router.use('/statistics', statisticsRoute);

module.exports = router;
        