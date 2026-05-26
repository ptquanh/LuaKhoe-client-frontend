export interface DetectionItem {
  disease: string;
  confidence: number;
}

/**
 * Raw prediction response from AI API.
 */
export interface PredictionApiResponse {
  disease: string;
  confidence: number;
  detections: DetectionItem[];
  status: string;
  model_version: string;
  latency_ms: number;
  saved_path: string;
  filename: string;
  low_confidence?: boolean;
  annotated_image?: string | null;
}

export interface TreatmentStep {
  disease_name: string;
  steps: string[];
}

export interface TreatmentProtocol {
  chemical: string | TreatmentStep[] | string[];
  biological: string | TreatmentStep[] | string[];
  cultural: string | string[];
}

export interface RecommendationResult {
  disease_name: string;
  severity_assessment: string;
  immediate_actions: string[];
  treatment_protocol: TreatmentProtocol;
  npk_adjustment: string;
  prevention_measures: string[];
  sources_used: string[];
  confidence_note: string;
  summary?: string;
}

export interface RecommendationResponse {
  status: string;
  recommendation: RecommendationResult;
  latency_ms: number;
  rag_chunks_used: number;
}

export interface AnalyzeApiResponse {
  prediction: PredictionApiResponse;
  recommendation: RecommendationResponse | null;
}

/**
 * Enriched result displayed in the UI.
 * Constructed by mapping AnalyzeApiResponse.
 */
export interface DiagnoseResult {
  disease_key: string;
  disease_name: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";

  // All unique diseases detected with their highest confidence
  detections: DetectionItem[];

  // From RAG Backend (Advanced info)
  rag_recommendation: RecommendationResult | null;

  // Annotated image with disease masks (base64 PNG)
  annotated_image: string | null;

  low_confidence: boolean;
  latency_ms: number;
}

export interface DiagnosePayload {
  image: File;
}

export interface Disease {
  id: string;
  name: string;
  scientificName?: string | null;
  signs?: string | null;
  status: string;
}

export interface DiagnosisResultResponse {
  id: string;
  diagnosisId: string;
  diseaseId: string;
  disease: Disease;
  confidence: number; // 0-100 decimal percentage
  maskPolygon?: any;
}

export interface DiagnosisAdvisory {
  advisory: RecommendationResult | string | any;
  sources: { source: string; id: string }[];
  disease: string;
}

export interface EnvAdjustment {
  original_scores: Record<string, number>;
  adjusted_scores: Record<string, number>;
  weather: {
    humidity: number;
    temperature: number;
    rainfall: string;
    wind: string;
    source: string;
  };
  applied: boolean;
}

export interface DiagnosisResponse {
  id: string;
  userId: string;
  originalImageUrl: string;
  resultImageUrl: string | null;
  weatherData: any | null;
  gpsLat: number | null;
  gpsLng: number | null;
  province: string | null;
  envDescription: string | null;
  modelVersionId: string;
  createdAt: string;
  results: DiagnosisResultResponse[];
  feedbacks?: any[];
  advisory?: DiagnosisAdvisory | null;

  // Enriched DiagnoseResult fields returned by Predict API
  disease_key?: string;
  disease_name?: string;
  confidence?: number;
  severity?: "low" | "medium" | "high" | "critical";
  detections?: DetectionItem[];
  rag_recommendation?: RecommendationResult | null;
  annotated_image?: string | null;
  low_confidence?: boolean;
  latency_ms?: number;
  env_adjustment?: EnvAdjustment | null;
}

export interface FieldParams {
  water?: string;
  growth?: string;
  density?: string;
  fog?: boolean;
  leafhopper?: boolean;
  pesticide?: boolean;
}

export interface CreateDiagnosisPayload {
  image: File;
  envDescription?: string | null;
  province?: string;
  gpsLat?: number;
  gpsLng?: number;
  fieldParams?: FieldParams;
  fieldId?: string;
}

export interface GetHistoryParams {
  limit?: number;
  offset?: number;
  keyword?: string;
  disease?: string;
  feedbackStatus?: string;
  fromDate?: string;
  toDate?: string;
  sort?: string;
}
