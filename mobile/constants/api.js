export const API_URL = "http://192.168.1.5:3000";
// export const API_URL = "https://expensemeter-backend.onrender.com";

export const AUTH_ROUTES = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
};

export const USER_ROUTES = {
  GET_USER_BY_ID: "/users/:id",
  UPDATE_USER_BY_ID: "/users/:id",
  DELETE_TRANSACTION: "/transactions/:id",
  DELETE_ALL_TRANSACTIONS: "/transactions/user/:id",
  CREATE_TRANSACTION: "/transactions",
};
