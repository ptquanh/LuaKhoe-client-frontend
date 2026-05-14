import axiosClient from "@/lib/axiosClient";
import { AiModel, CreateAiModelPayload } from "@/types/ai-model.type";
import { BaseResponse, PaginatedResponse } from "@/types/common.type";

export const aiModelService = {
  getAllModels: async (params?: {
    limit?: number;
    offset?: number;
    sort?: string;
  }): Promise<BaseResponse<PaginatedResponse<AiModel>>> => {
    const response = await axiosClient.get<
      BaseResponse<PaginatedResponse<AiModel>>
    >("/ai-models", { params });
    return response.data;
  },

  getActiveModel: async (): Promise<BaseResponse<AiModel>> => {
    const response =
      await axiosClient.get<BaseResponse<AiModel>>("/ai-models/active");
    return response.data;
  },

  getModelById: async (id: string): Promise<BaseResponse<AiModel>> => {
    const response = await axiosClient.get<BaseResponse<AiModel>>(
      `/ai-models/${id}`,
    );
    return response.data;
  },

  createModel: async (
    payload: CreateAiModelPayload,
  ): Promise<BaseResponse<AiModel>> => {
    const response = await axiosClient.post<BaseResponse<AiModel>>(
      "/ai-models",
      payload,
    );
    return response.data;
  },

  setActiveModel: async (id: string): Promise<BaseResponse<AiModel>> => {
    const response = await axiosClient.put<BaseResponse<AiModel>>(
      `/ai-models/${id}/active`,
    );
    return response.data;
  },
};
