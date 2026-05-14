import { useState } from "react";

import { diagnosisService } from "@/services/diagnosis.service";
import {
  CreateDiagnosisPayload,
  DiagnosisResponse,
} from "@/types/diagnose.type";

export function useDiagnose() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (payload: CreateDiagnosisPayload) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await diagnosisService.predict(payload);

      if (response.success && response.data) {
        const threshold = Number(
          process.env.NEXT_PUBLIC_DIAGNOSIS_CONFIDENCE_THRESHOLD,
        );
        const hasLowConfidence = response.data.results.some(
          (r) => r.confidence < threshold,
        );
        if (hasLowConfidence) {
          setError(
            "AI chưa đủ tin cậy về kết quả nhận diện này. Vui lòng chụp ảnh cận cảnh, rõ nét hơn để đạt độ chính xác cao nhất.",
          );
        }
        setResult(response.data);
        return response.data;
      } else {
        setError(
          response.message ||
            "Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.",
        );
        return null;
      }
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      setError(
        "Có lỗi hệ thống khi kết nối tới máy chủ phân tích. Vui lòng thử lại sau.",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { predict, isLoading, result, error, reset };
}
