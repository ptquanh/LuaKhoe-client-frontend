import { useState } from "react";

import { diagnoseService } from "@/services/diagnose.service";
import { DiagnoseResult } from "@/types/diagnose.type";

export function useDiagnose() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (image: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await diagnoseService.predict(image);

      if (data.low_confidence) {
        setError(
          "AI chưa đủ tin cậy về kết quả này. Vui lòng chụp lại ảnh rõ hơn hoặc liên hệ chuyên gia.",
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

  return { predict, isLoading, result, error, reset };
}
