export interface SeverityStyle {
  color: string;
  bg: string;
  border: string;
  label: string;
}

export interface ParsedDiagnoseResult {
  hasResult: boolean;
  isHealthy: boolean;
  diseaseName: string;
  confidencePercent: number;
  severityVal: string;
  severityStyle: SeverityStyle;
  resultsList: any[];
  advisoryData: any;
  ragRecommendation: any;
  annotatedImage: string | null;
}

export function getConfidencePercent(confidence?: string | number): number {
  if (confidence === undefined || confidence === null) return 85;
  const val = Number(confidence);
  if (isNaN(val)) return 85;
  return Math.round(val <= 1 ? val * 100 : val);
}

export function getSeverityStyle(severity: string): SeverityStyle {
  switch (severity) {
    case "critical":
      return {
        color: "text-[#E53935]",
        bg: "bg-[#FFEBEE]",
        border: "border-[#FFCDD2]",
        label: "Cấp bách",
      };
    case "high":
      return {
        color: "text-[#FB8C00]",
        bg: "bg-[#FFF3E0]",
        border: "border-[#FFE0B2]",
        label: "Nghiêm trọng",
      };
    case "medium":
      return {
        color: "text-[#FBC02D]",
        bg: "bg-[#FFFDE7]",
        border: "border-[#FFF9C4]",
        label: "Trung bình",
      };
    case "low":
      return {
        color: "text-[#2F9E44]",
        bg: "bg-[#E6F4EA]",
        border: "border-[#A5D6A7]",
        label: "Nhẹ",
      };
    default:
      return {
        color: "text-[#1976D2]",
        bg: "bg-[#E3F2FD]",
        border: "border-[#BBDEFB]",
        label: "Bình thường",
      };
  }
}

export function parseDiagnoseResult(
  result: Record<string, any> | null,
): ParsedDiagnoseResult {
  if (!result) {
    return {
      hasResult: false,
      isHealthy: false,
      diseaseName: "",
      confidencePercent: 0,
      severityVal: "normal",
      severityStyle: getSeverityStyle("normal"),
      resultsList: [],
      advisoryData: null,
      ragRecommendation: null,
      annotatedImage: null,
    };
  }

  const advisoryData = result.advisory;
  const resultsList =
    result.results && result.results.length > 0 ? result.results : [];

  const diseaseName =
    advisoryData?.disease ||
    resultsList[0]?.disease?.name ||
    result.disease_name ||
    "Bệnh trên lúa";

  const isHealthy =
    diseaseName.toLowerCase().includes("healthy") ||
    diseaseName.toLowerCase().includes("khỏe mạnh") ||
    diseaseName.toLowerCase().includes("bình thường") ||
    result.disease_key === "Healthy";

  const firstConfidence =
    resultsList[0]?.confidence !== undefined
      ? resultsList[0].confidence
      : result.confidence;

  const confidencePercent = getConfidencePercent(firstConfidence);

  const severityVal =
    result.severity || (confidencePercent > 80 ? "high" : "medium");

  const annotatedImage =
    result.annotated_image ||
    result.resultImageUrl ||
    result.originalImageUrl ||
    null;

  return {
    hasResult: true,
    isHealthy,
    diseaseName,
    confidencePercent,
    severityVal,
    severityStyle: getSeverityStyle(severityVal),
    resultsList,
    advisoryData,
    ragRecommendation: result.rag_recommendation,
    annotatedImage,
  };
}
