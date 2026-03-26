import axios, { AxiosResponse } from "axios";

import { AI_API_BASE_URL } from "@/constants/env";
import {
  DiagnoseResponse,
  MOCK_DIAGNOSE_RESPONSE,
} from "@/types/diagnose.type";

const aiAxiosClient = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: 60000,
});

const USE_MOCK = true; // Đổi thành false khi FastAPI xong

export const diagnoseService = {
  predict: async (image: File): Promise<DiagnoseResponse> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return MOCK_DIAGNOSE_RESPONSE;
    }

    const formData = new FormData();
    formData.append("file", image);

    const response: AxiosResponse<DiagnoseResponse> = await aiAxiosClient.post(
      "/predict",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
