import axios from "axios";
import axiosRetry from "axios-retry";
import { getCookie } from "./cookieFunc";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    return Math.pow(2, retryCount) * 1000;
  },
  shouldResetTimeout: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("authToken");
    console.log(token)

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
