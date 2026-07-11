// Notification service.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { NOTIFICATION_ROUTES } from "../constants/endPoints";
import * as notificationsFire from "./firebase/notificationsFire";

// Returns { items, total, page, limit, totalPages }
export const getByUser = async (userId, { page = 1 } = {}) => {
  if (isFirebase()) return notificationsFire.getByUser(userId, { page });
  const url = `${NOTIFICATION_ROUTES.GET_NOTIFICATIONS_BY_USER_ID.replace(":id", userId)}?page=${page}`;
  const res = await api.get(url);
  return res.data;
};

// Returns an array of unread notifications
export const getUnread = async (userId) => {
  if (isFirebase()) return notificationsFire.getUnread(userId);
  const res = await api.get(NOTIFICATION_ROUTES.GET_UNREAD_NOTIFICATIONS_BY_USER_ID.replace(":id", userId));
  return res.data;
};

export const remove = async (id) => {
  if (isFirebase()) return notificationsFire.remove(id);
  await api.delete(NOTIFICATION_ROUTES.DELETE_NOTIFICATION.replace(":id", id));
};

export const markRead = async (id) => {
  if (isFirebase()) return notificationsFire.markRead(id);
  await api.put(NOTIFICATION_ROUTES.UPDATE_NOTIFICATION_BY_ID.replace(":id", id));
};

export const removeAll = async (userId) => {
  if (isFirebase()) return notificationsFire.removeAll(userId);
  await api.delete(NOTIFICATION_ROUTES.DELETE_ALL_NOTIFICATIONS);
};
