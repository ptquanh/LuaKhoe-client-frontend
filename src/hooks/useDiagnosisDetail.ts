import { useState, useEffect, useCallback } from "react";
import { diagnosisService } from "@/services/diagnosis.service";
import { DiagnosisResponse } from "@/types/diagnose.type";

export function useDiagnosisDetail(id: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DiagnosisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await diagnosisService.getById(id);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Không thể tải chi tiết chẩn đoán.");
      }
    } catch (err) {
      console.error("Fetch diagnosis detail error:", err);
      setError("Có lỗi xảy ra khi tải thông tin chẩn đoán.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDetail,
  };
}
