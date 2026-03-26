import { AxiosResponse } from "axios";

import axiosClient from "@/lib/axiosClient";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth.type";

export const authService = {
  login: (payload: LoginPayload): Promise<AxiosResponse<AuthResponse>> =>
    axiosClient.post("/auth/login", payload),

  register: (payload: RegisterPayload): Promise<AxiosResponse<AuthResponse>> =>
    axiosClient.post("/auth/register", payload),

  getProfile: (): Promise<AxiosResponse> => axiosClient.get("/auth/whoami"),

  logout: (): Promise<AxiosResponse> => axiosClient.post("/auth/logout"),
};
