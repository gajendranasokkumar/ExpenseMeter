const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken');
const exportController = require('../controllers/exportController');

router.use(verifyToken);

router.get('/user/:userId', exportController.getUserExport);

module.exports = router;


