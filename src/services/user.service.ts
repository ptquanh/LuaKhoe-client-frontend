import axiosClient from "@/lib/axiosClient";
import {
  ApiResponse,
  UpdateProfilePayload,
  UserWithProfile,
} from "@/types/auth.type";

export const userService = {
  getProfile: async (): Promise<ApiResponse<UserWithProfile>> => {
    const response =
      await axiosClient.get<ApiResponse<UserWithProfile>>("/users/profile");
    return response.data;
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<ApiResponse<UserWithProfile>> => {
    const response = await axiosClient.put<ApiResponse<UserWithProfile>>(
      "/users/profile",
      payload,
    );
    return response.data;
  },
};
