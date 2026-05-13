import axiosClient from "@/lib/axiosClient";
import {
  ConfigCreatePayload,
  ConfigUpdatePayload,
  SystemConfig,
} from "@/types/admin.type";
import { IngestionRequest, IngestionResponse } from "@/types/advisory.type";

export const adminService = {
  getConfigs: async (): Promise<SystemConfig[]> => {
    const response = await axiosClient.get<SystemConfig[]>("/admin/configs/");
    return response.data;
  },

  addConfig: async (
    payload: ConfigCreatePayload,
  ): Promise<{ status: string; message: string }> => {
    const response = await axiosClient.post<{
      status: string;
      message: string;
    }>("/admin/configs/", payload);
    return response.data;
  },

  updateConfig: async (
    key: string,
    payload: ConfigUpdatePayload,
  ): Promise<{ status: string; message: string }> => {
    const response = await axiosClient.put<{
      status: string;
      message: string;
    }>(`/admin/configs/${key}`, payload);
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
