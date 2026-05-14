import axiosClient from "@/lib/axiosClient";
import {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResendEmailPayload,
  ResetPasswordPayload,
  User,
  UserWithProfile,
  VerifyOtpPayload,
} from "@/types/auth.type";
import { BaseResponse } from "@/types/common.type";

export const authService = {
  login: async (
    payload: LoginPayload,
  ): Promise<BaseResponse<LoginResponse>> => {
    const response = await axiosClient.post<BaseResponse<LoginResponse>>(
      "/auth/login",
      payload,
    );
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<BaseResponse<User>> => {
    const response = await axiosClient.post<BaseResponse<User>>(
      "/auth/register",
      payload,
    );
    return response.data;
  },

  getMe: async (): Promise<BaseResponse<UserWithProfile>> => {
    const response =
      await axiosClient.get<BaseResponse<UserWithProfile>>("/auth/whoami");
    return response.data;
  },

  verifyOtp: async (
    payload: VerifyOtpPayload,
  ): Promise<BaseResponse<unknown>> => {
    const response = await axiosClient.post<BaseResponse<unknown>>(
      "/auth/verify-otp",
      payload,
    );
    return response.data;
  },

  resendEmail: async (
    payload: ResendEmailPayload,
  ): Promise<BaseResponse<unknown>> => {
    const response = await axiosClient.post<BaseResponse<unknown>>(
      "/auth/resend-email",
      payload,
    );
    return response.data;
  },

  forgotPassword: async (
    payload: ForgotPasswordPayload,
  ): Promise<BaseResponse<unknown>> => {
    const response = await axiosClient.post<BaseResponse<unknown>>(
      "/auth/forgot-password",
      payload,
    );
    return response.data;
  },

  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<BaseResponse<unknown>> => {
    const response = await axiosClient.post<BaseResponse<unknown>>(
      "/auth/reset-password",
      payload,
    );
    return response.data;
  },

  changePassword: async (
    payload: ChangePasswordPayload,
  ): Promise<BaseResponse<unknown>> => {
    const response = await axiosClient.post<BaseResponse<unknown>>(
      "/auth/change-password",
      payload,
    );
    return response.data;
  },

  getSocialLoginUrl: (provider: string): string => {
    return `${axiosClient.defaults.baseURL}/auth/login/social?provider=${provider}`;
  },
};
