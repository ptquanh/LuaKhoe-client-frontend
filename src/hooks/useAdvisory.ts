import { useState } from "react";
import { advisoryService } from "@/services/advisory.service";
import { DiseaseEvent, RecommendationResponse } from "@/types/advisory.type";

export function useAdvisory() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recommend = async (events: DiseaseEvent[]) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await advisoryService.recommend(events);
      setResult(data);
    } catch {
      setError("Có lỗi xảy ra khi lấy khuyến nghị điều trị. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { recommend, isLoading, result, error, reset };
}
