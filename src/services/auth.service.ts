import { aiAxiosClient } from "@/lib/aiAxiosClient";
import { LoginPayload, RegisterPayload, TokenResponse, User } from "@/types/auth.type";

export const authService = {
  login: async (payload: LoginPayload): Promise<TokenResponse> => {
    const response = await aiAxiosClient.post<TokenResponse>("/auth/login", payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const response = await aiAxiosClient.post<User>("/auth/register", payload);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await aiAxiosClient.get<User>("/auth/me");
    return response.data;
  },
};
