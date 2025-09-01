const notificationService = require('../services/notificationService');


class NotificationController {
  async createNotification(req, res) {
    const notification = req.body;
    const newNotification = await notificationService.createNotification(notification);
    res.status(201).json(newNotification);
  }

  async getNotificationsByUserId(req, res) {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'user_id is required' });
      }
      const result = await notificationService.getNotificationsByUserId(id, { page, limit });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getUnreadNotificationsByUserId(req, res) {
    const user_id = req.params.id;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
    const notifications = await notificationService.getUnreadNotificationsByUserId(user_id);
    res.status(200).json(notifications);
  }

  async getNotifications(req, res) {
    const user_id = req.params.id;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
    const notifications = await notificationService.getNotifications(user_id);
    res.status(200).json(notifications);
  }
  
  async deleteNotification(req, res) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }
    const notification = await notificationService.deleteNotification(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  }
  
  async deleteAllNotifications(req, res) {
    const notifications = await notificationService.deleteAllNotifications();
    res.status(200).json(notifications);
  }

  async updateNotificationById(req, res) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }
    const notification = await notificationService.updateNotificationById(id);
    res.status(200).json(notification);
  }
  
  async updateAllNotifications(req, res) {
    const notifications = await notificationService.updateAllNotifications();
    res.status(200).json(notifications);
  }
}

module.exports = new NotificationController();  