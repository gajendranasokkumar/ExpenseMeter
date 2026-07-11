// User profile service.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { USER_ROUTES } from "../constants/endPoints";
import * as userFire from "./firebase/userFire";

export const getById = async (id) => {
  if (isFirebase()) return userFire.getById(id);
  const res = await api.get(USER_ROUTES.GET_USER_BY_ID.replace(":id", id));
  return res.data;
};

export const update = async (id, { name, email, avatar = "" }) => {
  if (isFirebase()) return userFire.update(id, { name, email, avatar });
  const res = await api.put(USER_ROUTES.UPDATE_USER_BY_ID.replace(":id", id), { name, email, avatar });
  return res.data;
};
