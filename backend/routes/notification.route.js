const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const verifyToken = require('../middlewares/VerifyToken');

router.use(verifyToken);

router.post('/', notificationController.createNotification);
router.get('/:id', notificationController.getNotificationsByUserId);
router.get('/:id/new', notificationController.getUnreadNotificationsByUserId);
router.get('/', notificationController.getNotifications);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/', notificationController.deleteAllNotifications);
router.put('/:id', notificationController.updateNotificationById);
router.put('/', notificationController.updateAllNotifications);

module.exports = router;