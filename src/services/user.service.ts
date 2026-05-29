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

  uploadAvatar: async (
    file: File,
  ): Promise<BaseResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.patch<
      BaseResponse<{ avatarUrl: string }>
    >("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    >("/admin/users", { params });
    return response.data;
  },

  updateUserStatusForAdmin: async (
    id: string,
    payload: { status: string; reason?: string },
  ): Promise<BaseResponse<any>> => {
    const response = await axiosClient.put<BaseResponse<any>>(
      `/admin/users/${id}/status`,
      payload,
    );
    return response.data;
  },

  deleteUserForAdmin: async (id: string): Promise<BaseResponse<any>> => {
    const response = await axiosClient.delete<BaseResponse<any>>(
      `/admin/users/${id}`,
    );
    return response.data;
  },
};
