import { useCallback, useEffect, useState } from "react";

import { diagnosisService } from "@/services/diagnosis.service";
import { DiagnosisResponse } from "@/types/diagnose.type";

export function useDiagnosisHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DiagnosisResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await diagnosisService.getHistory();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data.rows)
      ) {
        setData(response.data.rows);
      } else {
        setError(response.message || "Không thể tải lịch sử chẩn đoán.");
      }
    } catch (err) {
      console.error("Fetch history error:", err);
      setError("Có lỗi xảy ra khi kết nối máy chủ để lấy lịch sử.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
