const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const verifyToken = require('../middlewares/VerifyToken');

router.use(verifyToken);

router.post('/daily/:userId', statisticsController.getDailyStats);


module.exports = router;