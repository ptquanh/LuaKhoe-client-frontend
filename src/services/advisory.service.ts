import axiosClient from "@/lib/axiosClient";
import {
  DiseaseEvent,
  RecommendationRequest,
  RecommendationResponse,
} from "@/types/advisory.type";

export const advisoryService = {
  recommend: async (
    events: DiseaseEvent[],
  ): Promise<RecommendationResponse> => {
    const payload: RecommendationRequest = { events };
    const response = await axiosClient.post<RecommendationResponse>(
      "/recommend",
      payload,
    );
    return response.data;
  },
};
