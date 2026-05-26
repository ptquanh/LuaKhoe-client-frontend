import axiosClient from "@/lib/axiosClient";
import { BaseResponse, PaginatedResponse } from "@/types/common.type";

export interface DiseasePayload {
  name: string;
  scientificName?: string;
  signs?: string;
  severity?: string;
  treatment?: string;
  imageUrl?: string;
}

export interface DiseaseItem {
  id: string;
  name: string;
  scientificName?: string;
  signs?: string;
  status: string;
  severity?: string;
  treatment?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const diseaseService = {
  getDiseasesForAdmin: async (params?: {
    keyword?: string;
    limit?: number;
    offset?: number;
  }): Promise<BaseResponse<PaginatedResponse<DiseaseItem>>> => {
    const response = await axiosClient.get<
      BaseResponse<PaginatedResponse<DiseaseItem>>
    >("/diseases/admin", { params });
    return response.data;
  },

  getDiseases: async (): Promise<BaseResponse<DiseaseItem[]>> => {
    const response =
      await axiosClient.get<BaseResponse<DiseaseItem[]>>("/diseases");
    return response.data;
  },

  createDisease: async (
    payload: DiseasePayload,
  ): Promise<BaseResponse<DiseaseItem>> => {
    const response = await axiosClient.post<BaseResponse<DiseaseItem>>(
      "/diseases",
      payload,
    );
    return response.data;
  },

  updateDisease: async (
    id: string,
    payload: DiseasePayload,
  ): Promise<BaseResponse<DiseaseItem>> => {
    const response = await axiosClient.put<BaseResponse<DiseaseItem>>(
      `/diseases/${id}`,
      payload,
    );
    return response.data;
  },

  deleteDisease: async (id: string): Promise<BaseResponse<void>> => {
    const response = await axiosClient.delete<BaseResponse<void>>(
      `/diseases/${id}`,
    );
    return response.data;
  },

  uploadImage: async (
    file: File,
  ): Promise<BaseResponse<{ imageUrl: string }>> => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axiosClient.post<BaseResponse<{ imageUrl: string }>>(
      "/diseases/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
