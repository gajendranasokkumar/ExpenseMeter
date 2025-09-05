import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";
import { USER_ROUTES } from "../constants/endPoints";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const user = await AsyncStorage.getItem("user");
    setUser(JSON.parse(user));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const getUser = async () => {
    const response = await api.get(`${USER_ROUTES.GET_USER_BY_ID.replace(":id", user._id)}`);
    await AsyncStorage.setItem("user", JSON.stringify(response.data));
    setUser(response.data);
  };

  return <UserContext.Provider value={{ user, setUser, getUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);   