import { aiAxiosClient } from "@/lib/aiAxiosClient";
import { AnalyzeApiResponse } from "@/types/analyze.type";

export const analyzeService = {
  analyze: async (image: File): Promise<AnalyzeApiResponse> => {
    const formData = new FormData();
    formData.append("file", image);

    const response = await aiAxiosClient.post<AnalyzeApiResponse>(
      "/analyze",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return response.data;
  },
};
