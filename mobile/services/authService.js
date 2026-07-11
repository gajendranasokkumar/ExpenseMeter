// Auth service. Switches between REST backend and Firestore by DATA_PROVIDER.
import { isFirebase } from "../config/dataProvider";
import api from "../utils/api";
import { AUTH_ROUTES } from "../constants/endPoints";
import * as authFire from "./firebase/authFire";

// Returns { jwtToken, data: user }
export const login = async (email, password) => {
  if (isFirebase()) return authFire.login(email, password);
  const res = await api.post(AUTH_ROUTES.LOGIN, { email, password });
  return res.data;
};

// Returns the created user
export const register = async (name, email, password) => {
  if (isFirebase()) return authFire.register(name, email, password);
  const res = await api.post(AUTH_ROUTES.REGISTER, { name, email, password });
  return res.data;
};
