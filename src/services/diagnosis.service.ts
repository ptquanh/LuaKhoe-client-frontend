import axiosClient from "@/lib/axiosClient";
import { BaseResponse, PaginatedResponse } from "@/types/common.type";
import {
  CreateDiagnosisPayload,
  DiagnosisAdvisory,
  DiagnosisResponse,
  GetHistoryParams,
} from "@/types/diagnose.type";

export const diagnosisService = {
  predict: async (
    payload: CreateDiagnosisPayload,
  ): Promise<BaseResponse<DiagnosisResponse>> => {
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

    const response = await axiosClient.post<BaseResponse<DiagnosisResponse>>(
      "/diagnosis/predict",
      formData,
    );

    return response.data;
  },

  getHistory: async (
    params?: GetHistoryParams,
  ): Promise<BaseResponse<PaginatedResponse<DiagnosisResponse>>> => {
    const response = await axiosClient.get<
      BaseResponse<PaginatedResponse<DiagnosisResponse>>
    >("/diagnosis/history", { params });
    return response.data;
  },

  getById: async (id: string): Promise<BaseResponse<DiagnosisResponse>> => {
    const response = await axiosClient.get<BaseResponse<DiagnosisResponse>>(
      `/diagnosis/${id}`,
    );
    return response.data;
  },

  getAdvisory: async (
    diseaseName: string,
    context?: string,
  ): Promise<BaseResponse<DiagnosisAdvisory>> => {
    const response = await axiosClient.post<BaseResponse<DiagnosisAdvisory>>(
      "/nutrition/advisory",
      { diseaseName, context },
    );
    return response.data;
  },
};
