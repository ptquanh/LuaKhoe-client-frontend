import { aiAxiosClient } from "@/lib/aiAxiosClient";
import { SystemStatus } from "@/types/system.type";

export const systemService = {
  getStatus: async (): Promise<SystemStatus> => {
    const response = await aiAxiosClient.get<SystemStatus>("/status");
    return response.data;
  },
};
