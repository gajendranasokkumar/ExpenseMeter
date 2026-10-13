// Category service.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { CATEGORY_ROUTES } from "../constants/endPoints";
import * as categoriesFire from "./firebase/categoriesFire";

// Returns an array of categories
export const getAll = async (userId) => {
  if (isFirebase()) return categoriesFire.getAll(userId);
  const res = await api.post(CATEGORY_ROUTES.GET_ALL_CATEGORIES, { userId });
  return res.data.data;
};

export const create = async ({ name, icon, color, user_id, omitFromTotal }) => {
  if (isFirebase()) return categoriesFire.create({ name, icon, color, user_id, omitFromTotal });
  const res = await api.post(CATEGORY_ROUTES.CREATE_CATEGORY, { name, icon, color, user_id, omitFromTotal });
  return res.data.data;
};

export const update = async (id, { name, icon, color, isActive, userId, omitFromTotal }) => {
  if (isFirebase()) return categoriesFire.update(id, userId, { name, icon, color, isActive, omitFromTotal });
  const res = await api.put(CATEGORY_ROUTES.UPDATE_CATEGORY.replace(":id", id), {
    name,
    icon,
    color,
    isActive,
    userId,
    omitFromTotal,
  });
  return res.data.data;
};

export const removePermanent = async (id, userId) => {
  if (isFirebase()) return categoriesFire.removePermanent(id, userId);
  await api.delete(
    CATEGORY_ROUTES.PERMANENTLY_DELETE_CATEGORY.replace(":id", id).replace(":userId", userId)
  );
};
