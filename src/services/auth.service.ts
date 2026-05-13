import axiosClient from "@/lib/axiosClient";
import {
  ApiResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordPayload,
  ResendEmailPayload,
  User,
  UserWithProfile,
  VerifyOtpPayload,
} from "@/types/auth.type";

export const authService = {
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload,
    );
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<User>> => {
    const response = await axiosClient.post<ApiResponse<User>>(
      "/auth/register",
      payload,
    );
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<UserWithProfile>> => {
    const response =
      await axiosClient.get<ApiResponse<UserWithProfile>>("/auth/whoami");
    return response.data;
  },

  verifyOtp: async (
    payload: VerifyOtpPayload,
  ): Promise<ApiResponse<unknown>> => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      "/auth/verify-otp",
      payload,
    );
    return response.data;
  },

  resendEmail: async (
    payload: ResendEmailPayload,
  ): Promise<ApiResponse<unknown>> => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      "/auth/resend-email",
      payload,
    );
    return response.data;
  },

  forgotPassword: async (
    payload: ForgotPasswordPayload,
  ): Promise<ApiResponse<unknown>> => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      "/auth/forgot-password",
      payload,
    );
    return response.data;
  },

  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<ApiResponse<unknown>> => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      "/auth/reset-password",
      payload,
    );
    return response.data;
  },

  changePassword: async (
    payload: ChangePasswordPayload,
  ): Promise<ApiResponse<unknown>> => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      "/auth/change-password",
      payload,
    );
    return response.data;
  },

  getSocialLoginUrl: (provider: string): string => {
    return `${axiosClient.defaults.baseURL}/auth/login/social?provider=${provider}`;
  },
};
