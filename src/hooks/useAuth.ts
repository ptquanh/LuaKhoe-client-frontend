import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ACCESS_TOKEN } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import { LoginPayload, RegisterPayload, User } from "@/types/auth.type";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const token = getCookie(ACCESS_TOKEN);
      if (!token) return null;
      try {
        return await authService.getMe();
      } catch {
        deleteCookie(ACCESS_TOKEN);
        return null;
      }
    },
    retry: false,
  });

  const login = async (payload: LoginPayload, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      setCookie(ACCESS_TOKEN, res.access_token, {
        maxAge: 60 * 60 * 24 * 7,
      });
      await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      onSuccess?.();
    } catch (err: any) {
      const message = err.response?.data?.detail || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(payload);
      // After register, user needs to login or we could auto-login if the register endpoint returned a token
      // Currently backend register returns UserResponse, not Token
      onSuccess?.();
    } catch (err: any) {
      const message = err.response?.data?.detail || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    deleteCookie(ACCESS_TOKEN);
    queryClient.setQueryData(["auth-me"], null);
    window.location.href = ROUTES.LOGIN;
  };

  return { 
    user, 
    login, 
    register, 
    logout, 
    isLoading: isLoading || isUserLoading, 
    error 
  };
}
