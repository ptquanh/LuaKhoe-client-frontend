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
  advisory: string;
  sources: { source: string; id: string }[];
  disease: string;
}

export interface DiagnosisResponse {
  id: string;
  userId: string;
  originalImageUrl: string;
  resultImageUrl: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  weatherData: any | null;
  envDescription: string | null;
  modelVersionId: string;
  createdAt: string;
  results: DiagnosisResultResponse[];
  advisory?: DiagnosisAdvisory | null;
}

export interface CreateDiagnosisPayload {
  image: File;
  gpsLat?: number | null;
  gpsLng?: number | null;
  envDescription?: string | null;
}

export interface GetHistoryParams {
  limit?: number;
  offset?: number;
  keyword?: string;
  disease?: string;
  fromDate?: string;
  toDate?: string;
  sort?: string;
}

export interface PaginatedDiagnosisHistory {
  rows: DiagnosisResponse[];
  total: number;
  limit: number;
  offset: number;
}
