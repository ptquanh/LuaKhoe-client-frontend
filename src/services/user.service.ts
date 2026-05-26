import axiosClient from "@/lib/axiosClient";
import { UpdateProfilePayload, UserWithProfile } from "@/types/auth.type";
import { BaseResponse, PaginatedResponse } from "@/types/common.type";

export const userService = {
  getProfile: async (): Promise<BaseResponse<UserWithProfile>> => {
    const response =
      await axiosClient.get<BaseResponse<UserWithProfile>>("/users/profile");
    return response.data;
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<BaseResponse<UserWithProfile>> => {
    const response = await axiosClient.put<BaseResponse<UserWithProfile>>(
      "/users/profile",
      payload,
    );
    return response.data;
  },

  getUsersForAdmin: async (params?: {
    keyword?: string;
    role?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<BaseResponse<PaginatedResponse<any>>> => {
    const response = await axiosClient.get<
      BaseResponse<PaginatedResponse<any>>
    >("/users", { params });
    return response.data;
  },

  updateUserStatusForAdmin: async (
    id: string,
    payload: { status: string; reason?: string },
  ): Promise<BaseResponse<any>> => {
    const response = await axiosClient.put<BaseResponse<any>>(
      `/users/${id}/status`,
      payload,
    );
    return response.data;
  },

  deleteUserForAdmin: async (id: string): Promise<BaseResponse<any>> => {
    const response = await axiosClient.delete<BaseResponse<any>>(
      `/users/${id}`,
    );
    return response.data;
  },
};
