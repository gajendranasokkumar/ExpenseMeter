import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

const api = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // "Access-Control-Allow-Origin": "*"
    // "Access-Control-Allow-Headers": "Content-Type, Authorization"
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore token read errors
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
