import { useState } from "react";
import { adminService } from "@/services/admin.service";
import { IngestionRequest, IngestionResponse } from "@/types/advisory.type";

export function useAdminIngestion() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IngestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ingestText = async (payload: IngestionRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await adminService.ingestText(payload);
      setResult(data);
    } catch {
      setError("Có lỗi xảy ra khi nạp dữ liệu văn bản. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const ingestFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await adminService.ingestFile(file);
      setResult(data);
    } catch {
      setError("Có lỗi xảy ra khi nạp dữ liệu từ tệp. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { ingestText, ingestFile, isLoading, result, error, reset };
}
