import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

import { ACCESS_TOKEN } from "@/constants/auth";
import { API_BASE_URL } from "@/constants/env";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getCookie(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      deleteCookie(ACCESS_TOKEN);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
