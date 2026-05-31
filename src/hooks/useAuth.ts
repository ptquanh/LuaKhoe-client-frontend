import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useState } from "react";

import {
  ACCESS_TOKEN,
  ERROR_CODE_MAP,
  VALIDATION_ERROR_MAPPINGS,
} from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResendEmailPayload,
  ResetPasswordPayload,
  User,
  VerifyOtpPayload,
} from "@/types/auth.type";

export const getErrorMessage = (err: any): string => {
  if (!err) return "Đã có lỗi xảy ra. Vui lòng thử lại.";

  // Handle Network Error explicitly
  if (
    err.message === "Network Error" ||
    err.code === "ERR_NETWORK" ||
    (err.message && err.message.toLowerCase().includes("network error")) ||
    (!err.response && err.request)
  ) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet hoặc máy chủ.";
  }

  // Handle both Axios error (contains response data) and custom NestJS response object
  const data = err.response?.data || err;

  const code = data.code?.toLowerCase();
  if (code && ERROR_CODE_MAP[code]) {
    return ERROR_CODE_MAP[code];
  }

  let msg = data.message || data.detail || "";
  if (Array.isArray(msg)) {
    msg = msg.join(", ");
  }

  const msgLower = msg.toLowerCase();
  const matched = VALIDATION_ERROR_MAPPINGS.find((m) =>
    msgLower.includes(m.keyword),
  );
  if (matched) {
    return matched.msg;
  }

  return msg || "Đã có lỗi xảy ra. Vui lòng thử lại.";
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
        setError(getErrorMessage(res));
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
        setError(getErrorMessage(res));
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
        setError(getErrorMessage(res));
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
        setError(getErrorMessage(res));
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
        setError(getErrorMessage(res));
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
        setError(getErrorMessage(res));
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
        setError(getErrorMessage(res));
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.getSocialLoginProviderUrl("GOOGLE");
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError(getErrorMessage(res));
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
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
