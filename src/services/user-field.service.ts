import axiosClient from "@/lib/axiosClient";
import {
  CreateUserFieldPayload,
  UpdateUserFieldPayload,
  UserField,
} from "@/types/auth.type";
import { BaseResponse } from "@/types/common.type";

export const userFieldService = {
  getUserFields: async (): Promise<BaseResponse<UserField[]>> => {
    const response =
      await axiosClient.get<BaseResponse<UserField[]>>("/user-fields");
    return response.data;
  },

  createUserField: async (
    payload: CreateUserFieldPayload,
  ): Promise<BaseResponse<UserField>> => {
    const response = await axiosClient.post<BaseResponse<UserField>>(
      "/user-fields",
      payload,
    );
    return response.data;
  },

  updateUserField: async (
    id: string,
    payload: UpdateUserFieldPayload,
  ): Promise<BaseResponse<UserField>> => {
    const response = await axiosClient.put<BaseResponse<UserField>>(
      `/user-fields/${id}`,
      payload,
    );
    return response.data;
  },

  deleteUserField: async (id: string): Promise<BaseResponse<void>> => {
    const response = await axiosClient.delete<BaseResponse<void>>(
      `/user-fields/${id}`,
    );
    return response.data;
  },
};
