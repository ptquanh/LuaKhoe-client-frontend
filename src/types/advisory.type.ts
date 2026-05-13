export interface TreatmentProtocol {
  chemical?: string[];
  biological?: string[];
  cultural?: string[];
}

export interface RecommendationResult {
  disease_name: string;
  severity_assessment: string;
  immediate_actions: string[];
  treatment_protocol?: TreatmentProtocol;
}

export interface Lesion {
  mask_area_px?: number;
  [key: string]: any;
}

export interface DiseaseEvent {
  disease_class: string;
  confidence: number;
  lesions?: Lesion[];
}

export interface RecommendationRequest {
  events: DiseaseEvent[];
}

export interface RecommendationResponse {
  status: string;
  recommendation: RecommendationResult;
  latency_ms: number;
  rag_chunks_used: number;
}

export interface IngestionRequest {
  text: string;
  source: string;
  metadata?: Record<string, any>;
}

export interface IngestionResponse {
  status: string;
  message: string;
}
