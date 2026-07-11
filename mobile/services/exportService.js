// Export service.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { EXPORT_ROUTES } from "../constants/endPoints";
import * as exportFire from "./firebase/exportFire";

export const exportUser = async (userId) => {
  if (isFirebase()) return exportFire.exportUser(userId);
  const res = await api.get(EXPORT_ROUTES.USER_EXPORT.replace(":id", userId));
  return res.data;
};
