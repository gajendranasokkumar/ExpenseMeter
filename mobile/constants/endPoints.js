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
  GET_TRANSACTIONS_BY_USER_ID: "/transactions/user/:id",
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

export const BUDGET_ROUTES = {
  GET_BUDGETS_BY_USER_ID: "/budgets/user/:id",
  GET_BUDGETS_BY_USER_ID_AND_CATEGORY_FOR_CURRENT_MONTH: "/budgets/user/:id/category/:category/currentMonth/:currentMonth",
  GET_BUDGETS_AND_EXPENSES_BY_CATEGORY_FOR_MONTH_AND_YEAR: "/budgets/user/:id/categories-summary",
  CREATE_BUDGET: "/budgets",
  UPDATE_BUDGET: "/budgets/:id",
  GET_ACTIVE_BUDGETS_BY_USER_ID: "/budgets/active/:id",
  DELETE_BUDGET: "/budgets/:id",
  DELETE_ALL_BUDGETS: "/budgets/user/:id",
  GET_BUDGET_SUMMARY_BY_USER_ID: "/budgets/summary/:id",
  GET_BUDGET_BY_ID: "/budgets/:id",
  CREATE_MONTHLY_BUDGET_AS_PREVIOUS: "/budgets/user/:id/month/:month",
};

export const BANK_ROUTES = {
  CREATE_BANK: "/banks",
  GET_ALL_BANKS: "/banks/all",
  DELETE_BANK: "/banks/:id/user/:userId",
  PERMANENTLY_DELETE_BANK: "/banks/permanent/:id/user/:userId",
  GET_BANK_SUMMARY_BY_USER_ID: "/banks/summary/:id",
};

export const STATISTICS_ROUTES = {
  GET_DAILY_STATS: "/statistics/daily/:id",
  GET_MONTHLY_STATS: "/statistics/monthly/:id",
  GET_YEARLY_STATS: "/statistics/yearly/:id",
  GET_TOTAL_STATS: "/statistics/total/:id",
};

export const CATEGORY_ROUTES = {
  CREATE_CATEGORY: "/categories",
  GET_ALL_CATEGORIES: "/categories/all",
  GET_CATEGORY_BY_ID: "/categories/:id/user/:userId",
  UPDATE_CATEGORY: "/categories/:id",
  DELETE_CATEGORY: "/categories/:id/user/:userId",
  PERMANENTLY_DELETE_CATEGORY: "/categories/permanent/:id/user/:userId",
  GET_CATEGORY_SUMMARY: "/categories/summary/:userId",
};

export const EXPORT_ROUTES = {
  USER_EXPORT: "/export/user/:id",
};