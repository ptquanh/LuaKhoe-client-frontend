export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const AI_API_BASE_URL =
  process.env.NEXT_PUBLIC_AI_API_BASE_URL || "http://localhost:8000";

export const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";
