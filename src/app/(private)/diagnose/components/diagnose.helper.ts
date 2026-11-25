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
  envAdjustment: any;
  province: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  fieldParams: any | null;
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
        color: "text-[var(--severity-critical-text)]",
        bg: "bg-[var(--severity-critical-bg)]",
        border: "border-red-300 dark:border-red-800/70",
        label: "Cấp bách",
      };
    case "high":
      return {
        color: "text-[var(--severity-high-text)]",
        bg: "bg-[var(--severity-high-bg)]",
        border: "border-orange-300 dark:border-orange-800/70",
        label: "Nghiêm trọng",
      };
    case "medium":
      return {
        color: "text-[var(--severity-medium-text)]",
        bg: "bg-[var(--severity-medium-bg)]",
        border: "border-amber-300 dark:border-amber-800/70",
        label: "Trung bình",
      };
    case "low":
      return {
        color: "text-[var(--severity-low-text)]",
        bg: "bg-[var(--severity-low-bg)]",
        border: "border-[var(--primary-border)]",
        label: "Nhẹ",
      };
    default:
      return {
        color: "text-sky-700 dark:text-sky-300",
        bg: "bg-sky-50 dark:bg-sky-950/50",
        border: "border-sky-200 dark:border-sky-800/70",
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
      envAdjustment: null,
      province: null,
      gpsLat: null,
      gpsLng: null,
      fieldParams: null,
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
    envAdjustment: result.env_adjustment,
    province: result.province || null,
    gpsLat: result.gpsLat || null,
    gpsLng: result.gpsLng || null,
    fieldParams: result.fieldParams || null,
  };
}
