const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const userRoutes = require('./userRoutes');

router.get('/', homeController.getHome);
router.use('/users', userRoutes);

module.exports = router;
        