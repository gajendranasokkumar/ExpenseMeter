const NotificationModel = require('../models/Notifocation.model');


exports.createNotification = async (notification) => {
  const newNotification = await NotificationModel.create(notification);
  return newNotification;
};

exports.getNotifications = async (user_id) => {
  const notifications = await NotificationModel.find({ user_id }).sort({ created_at: -1});
  return notifications;
};

exports.getNotificationsByUserId = async (userId, { page = 1, limit = 10 } = {}) => {
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const filter = { user_id: userId };

  const [items, total] = await Promise.all([
    NotificationModel.find(filter)
      .sort({ created_at: -1})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    NotificationModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;
  return { items, total, page: pageNumber, limit: pageSize, totalPages };
};

exports.getUnreadNotificationsByUserId = async (user_id) => {
  const notifications = await NotificationModel.find({ user_id, is_read: false }).sort({ created_at: -1 });
  return notifications;
};

exports.deleteNotification = async (id) => {
  const deletedNotification = await NotificationModel.findByIdAndDelete(id);
  return deletedNotification;
};

exports.deleteAllNotifications = async () => {
  const deletedNotifications = await NotificationModel.deleteMany({});
  return deletedNotifications;
};

exports.updateNotificationById = async (id) => {
  const updatedNotification = await NotificationModel.findByIdAndUpdate(id, { is_read: true }, { new: true });
  return updatedNotification;
};

exports.updateAllNotifications = async () => {
  const updatedNotifications = await NotificationModel.updateMany({ is_read: false }, { is_read: true }, { new: true });
  return updatedNotifications;
};