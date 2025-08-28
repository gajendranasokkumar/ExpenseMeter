const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken');
const transactionController = require('../controllers/transactionController');

// All routes protected
router.use(verifyToken);

// GET /transactions/user/:userId
router.get('/user/:userId', transactionController.getTransactionsByUserId);

// POST /transactions
router.post('/', transactionController.createTransaction);

// DELETE /transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

// GET /transactions/summary/:userId
router.get('/summary/:userId', transactionController.getSummaryByUserId);

// DELETE /transactions/user/:userId (delete all)
router.delete('/user/:userId', transactionController.deleteAllTransactionsByUserId);

module.exports = router;


