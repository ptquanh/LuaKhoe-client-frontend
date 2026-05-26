import axiosClient from "@/lib/axiosClient";
import { BaseResponse, PaginatedResponse } from "@/types/common.type";

export interface NutritionChunk {
  id: string;
  content: string;
  source: string;
  chunkMetadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNutritionChunkPayload {
  content: string;
  source: string;
  metadata?: Record<string, any>;
}

export const nutritionService = {
  getChunks: async (params?: {
    limit?: number;
    offset?: number;
    keyword?: string;
    sort?: string;
  }): Promise<BaseResponse<PaginatedResponse<NutritionChunk>>> => {
    const response = await axiosClient.get<
      BaseResponse<PaginatedResponse<NutritionChunk>>
    >("/nutrition", { params });
    return response.data;
  },

  createChunk: async (
    payload: CreateNutritionChunkPayload,
  ): Promise<BaseResponse<NutritionChunk[]>> => {
    const response = await axiosClient.post<BaseResponse<NutritionChunk[]>>(
      "/nutrition",
      payload,
    );
    return response.data;
  },

  uploadFile: async (file: File): Promise<BaseResponse<NutritionChunk[]>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.post<BaseResponse<NutritionChunk[]>>(
      "/nutrition/upload",
      formData,
    );
    return response.data;
  },

  deleteChunk: async (id: string): Promise<BaseResponse<any>> => {
    const response = await axiosClient.delete<BaseResponse<any>>(
      `/nutrition/${id}`,
    );
    return response.data;
  },
};
