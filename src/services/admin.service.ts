import { aiAxiosClient } from "@/lib/aiAxiosClient";
import {
  ConfigCreatePayload,
  ConfigUpdatePayload,
  SystemConfig,
} from "@/types/admin.type";
import { IngestionRequest, IngestionResponse } from "@/types/advisory.type";

export const adminService = {
  getConfigs: async (): Promise<SystemConfig[]> => {
    const response = await aiAxiosClient.get<SystemConfig[]>("/admin/configs/");
    return response.data;
  },

  addConfig: async (
    payload: ConfigCreatePayload,
  ): Promise<{ status: string; message: string }> => {
    const response = await aiAxiosClient.post<{
      status: string;
      message: string;
    }>("/admin/configs/", payload);
    return response.data;
  },

  updateConfig: async (
    key: string,
    payload: ConfigUpdatePayload,
  ): Promise<{ status: string; message: string }> => {
    const response = await aiAxiosClient.put<{
      status: string;
      message: string;
    }>(`/admin/configs/${key}`, payload);
    return response.data;
  },

  ingestText: async (payload: IngestionRequest): Promise<IngestionResponse> => {
    const response = await aiAxiosClient.post<IngestionResponse>(
      "/ingest",
      payload,
    );
    return response.data;
  },

  ingestFile: async (file: File): Promise<IngestionResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await aiAxiosClient.post<IngestionResponse>(
      "/ingest/file",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return response.data;
  },
};
