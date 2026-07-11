// Statistics service.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { STATISTICS_ROUTES } from "../constants/endPoints";
import * as statisticsFire from "./firebase/statisticsFire";

export const daily = async (userId, day, month, year) => {
  if (isFirebase()) return statisticsFire.daily(userId, day, month, year);
  const res = await api.post(STATISTICS_ROUTES.GET_DAILY_STATS.replace(":id", userId), { day, month, year });
  return res.data;
};

export const monthly = async (userId, month, year) => {
  if (isFirebase()) return statisticsFire.monthly(userId, month, year);
  const res = await api.post(STATISTICS_ROUTES.GET_MONTHLY_STATS.replace(":id", userId), { month, year });
  return res.data;
};

export const yearly = async (userId, year) => {
  if (isFirebase()) return statisticsFire.yearly(userId, year);
  const res = await api.post(STATISTICS_ROUTES.GET_YEARLY_STATS.replace(":id", userId), { year });
  return res.data;
};

export const total = async (userId) => {
  if (isFirebase()) return statisticsFire.total(userId);
  const res = await api.get(STATISTICS_ROUTES.GET_TOTAL_STATS.replace(":id", userId));
  return res.data;
};
