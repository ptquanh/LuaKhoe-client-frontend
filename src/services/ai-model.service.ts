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

  getActiveModels: async (): Promise<BaseResponse<AiModel[]>> => {
    const response =
      await axiosClient.get<BaseResponse<AiModel[]>>("/ai-models/active");
    return response.data;
  },

  getModelById: async (id: string): Promise<BaseResponse<AiModel>> => {
    const response = await axiosClient.get<BaseResponse<AiModel>>(
      `/ai-models/${id}`,
    );
    return response.data;
  },

  createModel: async (
    payload: FormData | CreateAiModelPayload,
  ): Promise<BaseResponse<AiModel>> => {
    const headers =
      payload instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined;
    const response = await axiosClient.post<BaseResponse<AiModel>>(
      "/ai-models",
      payload,
      { headers, timeout: 0 },
    );
    return response.data;
  },

  setActiveModel: async (id: string): Promise<BaseResponse<AiModel>> => {
    const response = await axiosClient.put<BaseResponse<AiModel>>(
      `/ai-models/${id}/active`,
    );
    return response.data;
  },

  updateModel: async (
    id: string,
    payload: FormData | Partial<CreateAiModelPayload>,
  ): Promise<BaseResponse<AiModel>> => {
    const headers =
      payload instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined;
    const response = await axiosClient.patch<BaseResponse<AiModel>>(
      `/ai-models/${id}`,
      payload,
      { headers, timeout: 0 },
    );
    return response.data;
  },

  deleteModel: async (id: string): Promise<BaseResponse<any>> => {
    const response = await axiosClient.delete<BaseResponse<any>>(
      `/ai-models/${id}`,
    );
    return response.data;
  },
};
