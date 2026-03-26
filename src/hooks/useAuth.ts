import { deleteCookie, setCookie } from "cookies-next";
import { useState } from "react";

import { ACCESS_TOKEN } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import { LoginPayload, RegisterPayload } from "@/types/auth.type";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      setCookie(ACCESS_TOKEN, res.data.access_token, {
        maxAge: 60 * 60 * 24 * 7,
      });
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(payload);
      setCookie(ACCESS_TOKEN, res.data.access_token, {
        maxAge: 60 * 60 * 24 * 7,
      });
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    deleteCookie(ACCESS_TOKEN);
    window.location.href = ROUTES.LOGIN;
  };

  return { login, register, logout, isLoading, error };
}
