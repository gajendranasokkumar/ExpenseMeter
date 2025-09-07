const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const verifyToken = require('../middlewares/VerifyToken');

router.post('/all', verifyToken, bankController.getAllBanks);
router.post('/', verifyToken, bankController.createBank);
router.get('/:id/user/:userId', verifyToken, bankController.getBankById);
router.put('/:id', verifyToken, bankController.updateBankById);
router.delete('/:id/user/:userId', verifyToken, bankController.deleteBankById);
router.delete('/permanent/:id/user/:userId', verifyToken, bankController.permanentlyDeleteBankById);
router.get('/summary/:id', verifyToken, bankController.getBankSummaryByUserId);

module.exports = router;
