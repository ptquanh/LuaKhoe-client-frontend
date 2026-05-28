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
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
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

    // Translate standard connection/network errors to Vietnamese
    if (
      error.message === "Network Error" ||
      error.code === "ERR_NETWORK" ||
      (error.message && error.message.toLowerCase().includes("network error"))
    ) {
      try {
        error.message =
          "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet hoặc máy chủ.";
      } catch {
        Object.defineProperty(error, "message", {
          value:
            "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet hoặc máy chủ.",
          writable: true,
          configurable: true,
        });
      }
    } else if (error.code === "ECONNABORTED") {
      try {
        error.message = "Kết nối quá hạn (Timeout). Vui lòng thử lại sau.";
      } catch {
        Object.defineProperty(error, "message", {
          value: "Kết nối quá hạn (Timeout). Vui lòng thử lại sau.",
          writable: true,
          configurable: true,
        });
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
