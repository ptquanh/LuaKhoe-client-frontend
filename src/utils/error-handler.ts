import { ACCESS_TOKEN } from "@/constants/auth";
import { ERROR_MESSAGES } from "@/constants/error-messages";
import { message } from "antd";
import { AxiosError } from "axios";
import { deleteCookie } from "cookies-next";

interface NestJsErrorResponse {
  code?: string;
  errorCode?: string;
  statusCode?: number | string;
  message?: string | string[];
}

/**
 * Xử lý khi user mất quyền truy cập (401)
 */
const handleUnauthorized = () => {
  message.error(ERROR_MESSAGES["UNAUTHORIZED"] || "Phiên đăng nhập hết hạn");
  deleteCookie(ACCESS_TOKEN);

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/**
 * Global Handle API Error
 */
export const handleApiError = (
  error: unknown,
  customFallback?: string,
): void => {
  const axiosError = error as AxiosError<NestJsErrorResponse>;
  const errorData = axiosError.response?.data;

  const rawMsg =
    (typeof errorData?.message === "string"
      ? errorData.message
      : axiosError.message) || "";

  // 1. Handle Network Errors
  if (
    axiosError.code === "ERR_NETWORK" ||
    rawMsg.toLowerCase().includes("network error")
  ) {
    message.error(ERROR_MESSAGES["NETWORK_ERROR"]);
    return;
  }

  // 2. Lấy mã lỗi từ Backend (Backend nay đã tự trả về mã CONTENT_POLICY_VIOLATION nếu vi phạm AI)
  const code = (
    errorData?.code ||
    errorData?.errorCode ||
    errorData?.statusCode
  )?.toString();

  // 3. Handle 401 / UNAUTHORIZED
  if (code === "UNAUTHORIZED" || axiosError.response?.status === 401) {
    handleUnauthorized();
    return;
  }

  // 4. O(1) Dictionary Lookup cho các lỗi còn lại
  const formattedCode = code?.toUpperCase() as keyof typeof ERROR_MESSAGES;
  const mappedMessage = formattedCode ? ERROR_MESSAGES[formattedCode] : null;

  // 5. Hiển thị thông báo
  const displayMessage =
    mappedMessage ||
    customFallback ||
    (rawMsg !== "Request failed with status code 400" ? rawMsg : null) ||
    ERROR_MESSAGES["DEFAULT"];

  message.error(displayMessage);
};
