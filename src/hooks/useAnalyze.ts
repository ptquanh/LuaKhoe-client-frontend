import { useState } from "react";

import { analyzeService } from "@/services/analyze.service";
import { AnalyzeApiResponse } from "@/types/analyze.type";

export function useAnalyze() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (image: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeService.analyze(image);

      if (data.prediction.low_confidence) {
        setError(
          "AI chưa đủ tin cậy về kết quả nhận diện. Vui lòng chụp lại ảnh rõ hơn hoặc liên hệ chuyên gia.",
        );
      }

      setResult(data);
    } catch {
      setError("Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { analyze, isLoading, result, error, reset };
}
