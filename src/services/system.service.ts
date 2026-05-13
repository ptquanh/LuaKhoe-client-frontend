import axiosClient from "@/lib/axiosClient";
import { SystemStatus } from "@/types/system.type";

export const systemService = {
  getStatus: async (): Promise<SystemStatus> => {
    const response = await axiosClient.get<SystemStatus>("/status");
    return response.data;
  },
};
