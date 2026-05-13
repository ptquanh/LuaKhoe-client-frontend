import { RecommendationResponse } from "./advisory.type";
import { PredictionApiResponse } from "./diagnose.type";

export interface AnalyzeApiResponse {
  prediction: PredictionApiResponse;
  recommendation: RecommendationResponse | null;
}
