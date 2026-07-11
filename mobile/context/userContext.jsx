import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as userService from "../services/userService";

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
    const response = await userService.getById(user._id);
    await AsyncStorage.setItem("user", JSON.stringify(response));
    setUser(response);
  };

  return <UserContext.Provider value={{ user, setUser, getUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);   