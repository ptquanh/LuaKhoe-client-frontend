import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ACCESS_TOKEN } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  ResendEmailPayload,
  User,
  VerifyOtpPayload,
} from "@/types/auth.type";

const getErrorMessage = (err: any): string => {
  const data = err.response?.data;
  if (!data) return "Kết nối máy chủ thất bại.";
  if (Array.isArray(data.message)) return data.message.join(", ");
  return data.message || data.detail || "Đã có lỗi xảy ra. Vui lòng thử lại.";
};

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
        const res = await authService.getMe();
        if (res.success && res.data) {
          return res.data;
        }
        deleteCookie(ACCESS_TOKEN);
        return null;
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
      if (res.success && res.data) {
        setCookie(ACCESS_TOKEN, res.data.accessToken, {
          maxAge: 60 * 60 * 24 * 7,
        });
        await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
        onSuccess?.();
      } else {
        setError(
          res.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
        );
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(payload);
      if (res.success) {
        onSuccess?.();
      } else {
        setError(res.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (
    payload: VerifyOtpPayload,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.verifyOtp(payload);
      if (res.success) {
        onSuccess?.();
      } else {
        setError(res.message || "Mã xác thực không đúng hoặc đã hết hạn.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmail = async (
    payload: ResendEmailPayload,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.resendEmail(payload);
      if (res.success) {
        onSuccess?.();
      } else {
        setError(res.message || "Không thể gửi lại email. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (
    payload: ForgotPasswordPayload,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.forgotPassword(payload);
      if (res.success) {
        onSuccess?.();
      } else {
        setError(
          res.message || "Gửi yêu cầu khôi phục thất bại. Vui lòng thử lại.",
        );
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    payload: ResetPasswordPayload,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.resetPassword(payload);
      if (res.success) {
        onSuccess?.();
      } else {
        setError(res.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (
    payload: ChangePasswordPayload,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.changePassword(payload);
      if (res.success) {
        onSuccess?.();
      } else {
        setError(res.message || "Đổi mật khẩu thất bại.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = authService.getSocialLoginUrl("google");
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
    verifyOtp,
    resendEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    loginWithGoogle,
    logout,
    isLoading: isLoading || isUserLoading,
    error,
    setError,
  };
}
