export interface SystemStatus {
  status: string;
  ai_strategy: string;
  storage_strategy: string;
  labels: string[];
  rag_enabled: boolean;
  rag_chunks_count: number;
}
