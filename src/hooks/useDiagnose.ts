import { useState } from "react";

import { diagnoseService } from "@/services/diagnose.service";
import { DiagnoseResponse } from "@/types/diagnose.type";

export function useDiagnose() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (image: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await diagnoseService.predict(image);

      if (!data.is_valid_image) {
        setError(
          "Vui lòng chụp lại ảnh lá lúa rõ hơn để AI phân tích chính xác.",
        );
        return;
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
