export interface SystemConfig {
  id?: string;
  key: string;
  value: string;
  description: string;
  updatedAt?: string;
  updated_at?: string;
  isActive?: boolean;
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
