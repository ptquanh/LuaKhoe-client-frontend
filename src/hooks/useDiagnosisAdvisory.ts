import { useState, useCallback } from "react";
import { diagnosisService } from "@/services/diagnosis.service";
import { DiagnosisAdvisory } from "@/types/diagnose.type";

export function useDiagnosisAdvisory() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DiagnosisAdvisory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisory = useCallback(
    async (diseaseName: string, context?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await diagnosisService.getAdvisory(
          diseaseName,
          context,
        );
        if (response.success && response.data) {
          setData(response.data);
          return response.data;
        } else {
          setError(
            response.message || "Không thể lấy khuyến nghị tư vấn từ AI.",
          );
          return null;
        }
      } catch (err: any) {
        console.error("Fetch advisory error:", err);
        // Handle rate limit error code or standard server error
        if (err?.response?.status === 429) {
          setError(
            "Tần suất yêu cầu quá nhanh. Vui lòng đợi một lát rồi thử lại.",
          );
        } else {
          setError("Không thể kết nối máy chủ AI để lấy khuyến nghị điều trị.");
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchAdvisory,
    reset,
  };
}
