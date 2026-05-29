import { message } from "antd";
import { deleteCookie } from "cookies-next";
import { ACCESS_TOKEN } from "@/constants/auth";
import { ERROR_MESSAGES } from "@/constants/error-messages";

export const handleApiError = (error: any, customFallback?: string) => {
  // 1. Handle Network Errors
  if (
    error.message === "Network Error" ||
    error.code === "ERR_NETWORK" ||
    (error.message && error.message.toLowerCase().includes("network error"))
  ) {
    return message.error(ERROR_MESSAGES["NETWORK_ERROR"]);
  }

  // 2. Extract error data from NestJS/Axios response structure
  const errorData = error.response?.data;
  const code =
    errorData?.code ||
    errorData?.errorCode ||
    errorData?.statusCode?.toString();

  // 3. Robust check for content policy violations or AI/Gemini moderation flags in the raw message
  const rawMsg = errorData?.message || error.message || "";
  const isAiViolation =
    typeof rawMsg === "string" &&
    (rawMsg.toLowerCase().includes("profanity") ||
      rawMsg.toLowerCase().includes("offensive") ||
      rawMsg.toLowerCase().includes("appropriate"));

  if (code === "CONTENT_POLICY_VIOLATION" || isAiViolation) {
    return message.error(ERROR_MESSAGES["CONTENT_POLICY_VIOLATION"]);
  }

  // 4. Handle 401 / UNAUTHORIZED token expiration
  if (code === "UNAUTHORIZED" || error.response?.status === 401) {
    message.error(ERROR_MESSAGES["UNAUTHORIZED"]);
    deleteCookie(ACCESS_TOKEN);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return;
  }

  // 5. General message fallback priority:
  // Centralized Dictionary -> Custom Fallback String -> Backend Response Message -> Global Default Error Message
  const displayMessage =
    ERROR_MESSAGES[code] ||
    customFallback ||
    (typeof errorData?.message === "string" ? errorData.message : null) ||
    ERROR_MESSAGES["DEFAULT"];

  message.error(displayMessage);
};
