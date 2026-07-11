// Budget service.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { BUDGET_ROUTES } from "../constants/endPoints";
import * as budgetsFire from "./firebase/budgetsFire";

// Returns { items, total, page, limit, totalPages } (items include amountSpent)
export const getByUser = async (userId, { page = 1, startDate, endDate } = {}) => {
  if (isFirebase()) return budgetsFire.getByUser(userId, { page, startDate, endDate });
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const url = `${BUDGET_ROUTES.GET_BUDGETS_BY_USER_ID.replace(":id", userId)}?${params.toString()}`;
  const res = await api.get(url);
  return res.data;
};

// Returns { ...budget, totalAmountSpentonThisMonth }
export const getMonthlyForCurrentMonth = async (userId, category, currentMonth) => {
  if (isFirebase()) return budgetsFire.getMonthlyForCurrentMonth(userId, category, currentMonth);
  const url = BUDGET_ROUTES.GET_BUDGETS_BY_USER_ID_AND_CATEGORY_FOR_CURRENT_MONTH.replace(":id", userId)
    .replace(":category", category)
    .replace(":currentMonth", currentMonth);
  const res = await api.get(url);
  return res.data;
};

// Returns { month, year, categories: [...] }
export const getCategoriesSummary = async (userId, month, year) => {
  if (isFirebase()) return budgetsFire.getCategoriesSummary(userId, month, year);
  const base = BUDGET_ROUTES.GET_BUDGETS_AND_EXPENSES_BY_CATEGORY_FOR_MONTH_AND_YEAR.replace(":id", userId);
  const params = new URLSearchParams({ month: String(month), year: String(year) });
  const res = await api.get(`${base}?${params.toString()}`);
  return res.data;
};

export const create = async (payload) => {
  if (isFirebase()) return budgetsFire.create(payload);
  const res = await api.post(BUDGET_ROUTES.CREATE_BUDGET, payload);
  return res.data;
};

export const remove = async (id) => {
  if (isFirebase()) return budgetsFire.remove(id);
  await api.delete(BUDGET_ROUTES.DELETE_BUDGET.replace(":id", id));
};

export const setAsPrevious = async (userId, month) => {
  if (isFirebase()) return budgetsFire.setAsPrevious(userId, month);
  const url = BUDGET_ROUTES.CREATE_MONTHLY_BUDGET_AS_PREVIOUS.replace(":id", userId).replace(":month", month);
  const res = await api.post(url);
  return res.data;
};
