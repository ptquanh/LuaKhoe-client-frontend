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

export enum SYSTEM_CONFIG_KEY {
  CONFIDENCE_THRESHOLD = "CONFIDENCE_THRESHOLD",
  MAX_IMAGE_SIZE_MB = "MAX_IMAGE_SIZE_MB",
  RAG_CONTEXT_WINDOW = "RAG_CONTEXT_WINDOW",
  RAG_CHUNK_SIZE = "RAG_CHUNK_SIZE",
  RAG_CHUNK_OVERLAP = "RAG_CHUNK_OVERLAP",
  RAG_RAW_LIMIT = "RAG_RAW_LIMIT",
  WEATHER_CACHE_TTL_MINUTES = "WEATHER_CACHE_TTL_MINUTES",
  MAX_DIAGNOSIS_PER_DAY = "MAX_DIAGNOSIS_PER_DAY",
  POST_EXPIRE_DAYS = "POST_EXPIRE_DAYS",
  BANNED_WORDS = "BANNED_WORDS",
  AI_AUTO_MODERATION_ENABLED = "AI_AUTO_MODERATION_ENABLED",
  AI_MODERATION_POST_ROLES = "AI_MODERATION_POST_ROLES",
  AI_MODERATION_COMMENT_ROLES = "AI_MODERATION_COMMENT_ROLES",
  AI_CRON_MODERATION_ENABLED = "AI_CRON_MODERATION_ENABLED",
  AI_CRON_DELAY_MINUTES = "AI_CRON_DELAY_MINUTES",
}
