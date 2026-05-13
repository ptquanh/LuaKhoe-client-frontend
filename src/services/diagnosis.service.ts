import axiosClient from "@/lib/axiosClient";
import { ApiResponse } from "@/types/auth.type";
import {
  CreateDiagnosisPayload,
  DiagnosisResponse,
  DiagnosisAdvisory,
  GetHistoryParams,
  PaginatedDiagnosisHistory,
} from "@/types/diagnosis.type";

export const diagnosisService = {
  predict: async (
    payload: CreateDiagnosisPayload,
  ): Promise<ApiResponse<DiagnosisResponse>> => {
    const formData = new FormData();
    formData.append("image", payload.image);

    if (payload.gpsLat !== undefined && payload.gpsLat !== null) {
      formData.append("gpsLat", String(payload.gpsLat));
    }
    if (payload.gpsLng !== undefined && payload.gpsLng !== null) {
      formData.append("gpsLng", String(payload.gpsLng));
    }
    if (payload.envDescription) {
      formData.append("envDescription", payload.envDescription);
    }

    const response = await axiosClient.post<ApiResponse<DiagnosisResponse>>(
      "/diagnosis/predict",
      formData,
    );

    return response.data;
  },

  getHistory: async (
    params?: GetHistoryParams,
  ): Promise<ApiResponse<PaginatedDiagnosisHistory>> => {
    const response = await axiosClient.get<
      ApiResponse<PaginatedDiagnosisHistory>
    >("/diagnosis/history", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<DiagnosisResponse>> => {
    const response = await axiosClient.get<ApiResponse<DiagnosisResponse>>(
      `/diagnosis/${id}`,
    );
    return response.data;
  },

  getAdvisory: async (
    diseaseName: string,
    context?: string,
  ): Promise<ApiResponse<DiagnosisAdvisory>> => {
    const response = await axiosClient.post<ApiResponse<DiagnosisAdvisory>>(
      "/nutrition/advisory",
      { diseaseName, context },
    );
    return response.data;
  },
};
