import { AxiosResponse } from "axios";

import axiosClient from "@/lib/axiosClient";
import { DiagnoseResult, AnalyzeApiResponse } from "@/types/diagnose.type";

function mapApiResponseToResult(raw: AnalyzeApiResponse): DiagnoseResult {
  const prediction = raw.prediction;

  // Default fallback values
  let severity: "low" | "medium" | "high" | "critical" = "medium";
  let diseaseName = prediction.disease;

  // Determine severity and disease name based on RAG if available
  if (raw.recommendation && raw.recommendation.recommendation) {
    const ragRec = raw.recommendation.recommendation;
    if (ragRec.disease_name && ragRec.disease_name !== "") {
      diseaseName = ragRec.disease_name;
    }

    if (ragRec.severity_assessment) {
      const severityText = ragRec.severity_assessment.toLowerCase();
      if (
        severityText.includes("cấp bách") ||
        severityText.includes("critical")
      )
        severity = "critical";
      else if (
        severityText.includes("nghiêm trọng") ||
        severityText.includes("high")
      )
        severity = "high";
      else if (severityText.includes("nhẹ") || severityText.includes("low"))
        severity = "low";
      // "trung bình" / "medium" or unrecognized texts default to "medium"
    }
  }

  // Handle Healthy explicitly
  if (prediction.disease.toLowerCase() === "healthy") {
    severity = "low";
    diseaseName = "Khỏe mạnh";
  }

  return {
    disease_key: prediction.disease,
    disease_name: diseaseName,
    confidence: prediction.confidence,
    severity: severity,
    rag_recommendation: raw.recommendation?.recommendation || null,
    annotated_image: prediction.annotated_image || null,
    detections: prediction.detections || [],
    low_confidence: prediction.low_confidence ?? false,
    latency_ms: prediction.latency_ms + (raw.recommendation?.latency_ms || 0),
  };
}

export const diagnoseService = {
  predict: async (image: File): Promise<DiagnoseResult> => {
    const formData = new FormData();
    formData.append("file", image);

    const response: AxiosResponse<AnalyzeApiResponse> = await axiosClient.post(
      "/analyze",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return mapApiResponseToResult(response.data);
  },
};
