import axiosClient from "@/lib/axiosClient";
import { UpdateProfilePayload, UserWithProfile } from "@/types/auth.type";
import { BaseResponse } from "@/types/common.type";

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
};
