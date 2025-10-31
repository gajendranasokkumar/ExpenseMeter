const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const verifyToken = require('../middlewares/VerifyToken');

router.use(verifyToken);

router.post('/daily/:userId', statisticsController.getDailyStats);
router.post('/monthly/:userId', statisticsController.getMonthlySummary);
router.post('/yearly/:userId', statisticsController.getYearlyStats);
router.get('/total/:userId', statisticsController.getTotalStats);


module.exports = router;