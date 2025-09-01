export const API_URL = "http://192.168.1.5:3000";
// export const API_URL = "https://expensemeter-backend.onrender.com";

export const AUTH_ROUTES = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
};

export const USER_ROUTES = {
  GET_USER_BY_ID: "/users/:id",
  UPDATE_USER_BY_ID: "/users/:id",
};


export const TRANSACTION_ROUTES = {
  GET_TRANSACTIONS: "/transactions",
  GET_TRANSACTION_BY_ID: "/transactions/:id",
  CREATE_TRANSACTION: "/transactions",
  UPDATE_TRANSACTION: "/transactions/:id",
  DELETE_TRANSACTION: "/transactions/:id",
  DELETE_ALL_TRANSACTIONS: "/transactions/user/:id",
};

export const NOTIFICATION_ROUTES = {
  GET_NOTIFICATIONS: "/notifications",
  GET_NOTIFICATIONS_BY_USER_ID: "/notifications/:id",
  GET_UNREAD_NOTIFICATIONS_BY_USER_ID: "/notifications/:id/new",
  CREATE_NOTIFICATION: "/notifications",
  DELETE_NOTIFICATION: "/notifications/:id",
  DELETE_ALL_NOTIFICATIONS: "/notifications",
  UPDATE_NOTIFICATION_BY_ID: "/notifications/:id",
  UPDATE_ALL_NOTIFICATIONS: "/notifications",
};