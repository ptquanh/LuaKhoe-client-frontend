import axiosClient from "@/lib/axiosClient";
import {
  ConfigCreatePayload,
  ConfigUpdatePayload,
  SystemConfig,
} from "@/types/admin.type";
import { IngestionRequest, IngestionResponse } from "@/types/advisory.type";
import { BaseResponse } from "@/types/common.type";

export const adminService = {
  getConfigs: async (): Promise<SystemConfig[]> => {
    const response =
      await axiosClient.get<BaseResponse<SystemConfig[]>>("/admin/configs/");
    return response.data.data || [];
  },

  addConfig: async (
    payload: ConfigCreatePayload,
  ): Promise<{ status: string; message: string }> => {
    const response = await axiosClient.post<BaseResponse<any>>(
      "/admin/configs/",
      payload,
    );
    return {
      status: response.data.success ? "success" : "error",
      message: response.data.message || "Operation completed",
    };
  },

  updateConfig: async (
    key: string,
    payload: ConfigUpdatePayload,
  ): Promise<{ status: string; message: string }> => {
    const response = await axiosClient.put<BaseResponse<any>>(
      `/admin/configs/${key}`,
      payload,
    );
    return {
      status: response.data.success ? "success" : "error",
      message: response.data.message || "Operation completed",
    };
  },

  getBannedWords: async (): Promise<BaseResponse<any>> => {
    const response = await axiosClient.get<BaseResponse<any>>(
      "/admin/configs/banned-words",
    );
    return response.data;
  },

  getDashboardStats: async (): Promise<BaseResponse<any>> => {
    const response = await axiosClient.get<BaseResponse<any>>(
      "/admin/dashboard/stats",
    );
    return response.data;
  },

  ingestText: async (payload: IngestionRequest): Promise<IngestionResponse> => {
    const response = await axiosClient.post<IngestionResponse>(
      "/ingest",
      payload,
    );
    return response.data;
  },

  ingestFile: async (file: File): Promise<IngestionResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<IngestionResponse>(
      "/ingest/file",
      formData,
    );

    return response.data;
  },
};
