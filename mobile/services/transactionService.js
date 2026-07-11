// Transaction service.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { TRANSACTION_ROUTES } from "../constants/endPoints";
import * as transactionsFire from "./firebase/transactionsFire";

// Returns { items, total, page, limit, totalPages }
export const getByUser = async (userId, { page = 1, startDate, endDate } = {}) => {
  if (isFirebase()) return transactionsFire.getByUser(userId, { page, startDate, endDate });
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const url = `${TRANSACTION_ROUTES.GET_TRANSACTIONS_BY_USER_ID.replace(":id", userId)}?${params.toString()}`;
  const res = await api.get(url);
  return res.data;
};

export const create = async (payload) => {
  if (isFirebase()) return transactionsFire.create(payload);
  const res = await api.post(TRANSACTION_ROUTES.CREATE_TRANSACTION, payload);
  return res.data;
};

export const remove = async (id) => {
  if (isFirebase()) return transactionsFire.remove(id);
  await api.delete(TRANSACTION_ROUTES.DELETE_TRANSACTION.replace(":id", id));
};

export const removeAllByUser = async (userId) => {
  if (isFirebase()) return transactionsFire.removeAllByUser(userId);
  await api.delete(TRANSACTION_ROUTES.DELETE_ALL_TRANSACTIONS.replace(":id", userId));
};

// Returns { balance, income, expenses }
export const summary = async (userId) => {
  if (isFirebase()) return transactionsFire.summary(userId);
  const res = await api.get(TRANSACTION_ROUTES.GET_SUMMARY_BY_USER_ID.replace(":id", userId));
  return res.data;
};

// Transfer money between two banks (creates linked out/in transactions).
// Returns { outgoing, incoming }
export const transfer = async ({ user_id, fromBank, toBank, amount, date, note }) => {
  if (isFirebase()) return transactionsFire.transfer({ user_id, fromBank, toBank, amount, date, note });
  const res = await api.post(TRANSACTION_ROUTES.TRANSFER, { user_id, fromBank, toBank, amount, date, note });
  return res.data;
};
