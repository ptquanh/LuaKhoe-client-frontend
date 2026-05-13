import { aiAxiosClient } from "@/lib/aiAxiosClient";
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
    const response = await aiAxiosClient.post<RecommendationResponse>(
      "/recommend",
      payload,
    );
    return response.data;
  },
};
