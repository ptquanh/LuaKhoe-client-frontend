export interface SystemConfig {
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export interface ConfigCreatePayload {
  key: string;
  value: string;
  description?: string;
}

export interface ConfigUpdatePayload {
  value: string;
  description?: string;
}
