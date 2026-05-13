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

export interface TreatmentProtocol {
  chemical: string;
  biological: string;
  cultural: string;
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
