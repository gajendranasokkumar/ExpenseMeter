// Bank service.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { BANK_ROUTES } from "../constants/endPoints";
import * as banksFire from "./firebase/banksFire";

// Returns an array of banks
export const getAll = async (userId) => {
  if (isFirebase()) return banksFire.getAll(userId);
  const res = await api.post(BANK_ROUTES.GET_ALL_BANKS, { userId });
  return res.data.data;
};

export const create = async ({ name, logo, ifsc, userId, isSavings = false }) => {
  if (isFirebase()) return banksFire.create({ name, logo, ifsc, userId, isSavings });
  const res = await api.post(BANK_ROUTES.CREATE_BANK, { name, logo, ifsc, userId, isSavings });
  return res.data.data;
};

export const removePermanent = async (id, userId) => {
  if (isFirebase()) return banksFire.removePermanent(id, userId);
  await api.delete(BANK_ROUTES.PERMANENTLY_DELETE_BANK.replace(":id", id).replace(":userId", userId));
};

// Returns an array of banks with availableBalance
export const summary = async (userId) => {
  if (isFirebase()) return banksFire.summary(userId);
  const res = await api.get(BANK_ROUTES.GET_BANK_SUMMARY_BY_USER_ID.replace(":id", userId));
  return res.data.data;
};
