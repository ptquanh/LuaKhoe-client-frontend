import axiosClient from "@/lib/axiosClient";
import { AnalyzeApiResponse } from "@/types/analyze.type";

export const analyzeService = {
  analyze: async (image: File): Promise<AnalyzeApiResponse> => {
    const formData = new FormData();
    formData.append("file", image);

    const response = await axiosClient.post<AnalyzeApiResponse>(
      "/analyze",
      formData,
    );

    return response.data;
  },
};
