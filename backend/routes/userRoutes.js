const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/VerifyToken');

// Authentication routes
router.post('/register', userController.createUser);
router.post('/login', userController.login);

// User management routes
router.get('/all', userController.getAllUsers);
router.get('/', verifyToken, userController.getUser);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;
