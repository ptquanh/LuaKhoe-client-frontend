import axios from "axios";
import { getCookie } from "cookies-next";

import { AI_API_BASE_URL } from "@/constants/env";

export const aiAxiosClient = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: 60000,
});

aiAxiosClient.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
