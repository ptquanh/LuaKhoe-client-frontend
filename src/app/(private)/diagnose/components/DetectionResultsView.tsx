import { Info, Maximize, Target, TrendingUp } from "lucide-react";

import { getConfidencePercent, SeverityStyle } from "./diagnose.helper";

interface DetectionResultsViewProps {
  resultsList: any[];
  diseaseName: string;
  confidencePercent: number;
  severityStyle: SeverityStyle;
  envAdjustment?: any;
}

export function DetectionResultsView({
  resultsList,
  diseaseName,
  confidencePercent,
  severityStyle,
  envAdjustment,
}: DetectionResultsViewProps) {
  // Group detections by disease name to ensure no duplicates, keeping max confidence
  const aggregatedDetections = resultsList.reduce(
    (acc: any[], current: any) => {
      const name = current.disease?.name || current.disease || diseaseName;
      const existing = acc.find((item) => item.name === name);
      if (!existing || current.confidence > existing.confidence) {
        if (existing) {
          existing.confidence = current.confidence;
          existing.color = current.color || existing.color;
          existing.diseaseKey = current.disease?.key || current.diseaseKey;
          existing.affectedAreaRatio =
            current.affectedAreaRatio || existing.affectedAreaRatio;
        } else {
          acc.push({
            name,
            confidence: current.confidence,
            color: current.color || "#FB8C00", // Default orange if color is missing
            diseaseKey: current.disease?.key || current.diseaseKey,
            affectedAreaRatio: current.affectedAreaRatio || 0.0,
          });
        }
      }
      return acc;
    },
    [],
  );

  const detections =
    aggregatedDetections.length > 0
      ? aggregatedDetections
      : [
          {
            name: diseaseName,
            confidence: confidencePercent,
            color: "#FB8C00",
            diseaseKey: null,
            affectedAreaRatio: 0.0,
          },
        ];

  return (
    <div className="mb-6 space-y-4">
      {detections.map((det: any, i: number) => {
        const detPercent = getConfidencePercent(det.confidence);
        const detName = det.name;
        const color = det.color || "#FB8C00";

        // Find if this specific detection has an original score in envAdjustment
        const originalScore = envAdjustment?.original_scores?.[det.diseaseKey];
        const isAdjusted =
          originalScore !== undefined &&
          Math.abs(originalScore - det.confidence) > 0.001;
        const originalPercent =
          originalScore !== undefined
            ? getConfidencePercent(originalScore)
            : null;

        return (
          <div
            key={i}
            className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm transition-all hover:border-[#FB8C00]/30"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-[600] tracking-wider text-[#9E9E9E] uppercase">
                  Phát hiện #{i + 1}
                </span>
                {/* Color Legend (Matches bounding box on image) */}
                <div
                  className="flex h-4 w-4 items-center justify-center rounded-sm border border-black/10 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={`Vùng khoanh vùng trên ảnh: ${color}`}
                >
                  <Target
                    className={`h-2.5 w-2.5 ${color.toLowerCase() === "#f3f3f3" || color.toLowerCase() === "#ffffff" || color.toLowerCase() === "#0bffff" || color.toLowerCase() === "#ffff44" ? "text-black/60" : "text-white"}`}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-[600] text-[#FB8C00]">
                {isAdjusted ? (
                  <div
                    className="flex items-center gap-1 rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[10px] text-[#2F9E44]"
                    title={`Đã điều chỉnh từ ${originalPercent}%`}
                  >
                    <TrendingUp className="h-3 w-3" /> Đã điều chỉnh
                  </div>
                ) : (
                  <>
                    <Info className="h-3.5 w-3.5" /> AI Phân tích
                  </>
                )}
              </div>
            </div>

            {/* Disease Name */}
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-[20px] font-[700] text-[#E65100]">
                {detName}
              </h2>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-[#F0F2F5] bg-[#FAFAFA] p-2.5">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-[500] text-[#5C5C5C]">
                  Độ tin cậy:
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full border border-black/5 bg-[#E0E0E0] shadow-inner">
                  <div
                    className="h-full border-r border-black/10 transition-all duration-500 ease-out"
                    style={{
                      width: `${detPercent}%`,
                      backgroundColor: isAdjusted ? "#2F9E44" : "#FB8C00",
                    }}
                  />
                </div>
                <span className="text-[13px] font-[700] text-[#1B1B1B]">
                  {detPercent}%
                </span>
              </div>

              {det.affectedAreaRatio !== undefined &&
                det.affectedAreaRatio > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-[500] text-[#5C5C5C]">
                      Diện tích nhiễm:
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full border border-black/5 bg-[#E0E0E0] shadow-inner">
                      <div
                        className="h-full border-r border-black/10 transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(100, Math.round(det.affectedAreaRatio * 100))}%`,
                          backgroundColor:
                            det.affectedAreaRatio > 0.35
                              ? "#C62828"
                              : "#FB8C00",
                        }}
                      />
                    </div>
                    <span
                      className={`text-[13px] font-[700] ${det.affectedAreaRatio > 0.35 ? "text-[#C62828]" : "text-[#1B1B1B]"}`}
                    >
                      {(det.affectedAreaRatio * 100).toFixed(1)}%{" "}
                      {det.affectedAreaRatio > 0.35 && "(Nguy cấp)"}
                    </span>
                  </div>
                )}

              {isAdjusted && (
                <div className="flex justify-between px-1 text-[11px] text-[#5C5C5C]">
                  <span>Gốc: {originalPercent}%</span>
                  <span className="font-[600] text-[#2F9E44]">
                    +{detPercent - (originalPercent || 0)}% (tối ưu theo môi
                    trường)
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Overall Severity Assessment */}
      <div
        className={`flex items-center justify-between rounded-lg border p-3 shadow-sm ${severityStyle.bg} ${severityStyle.border}`}
      >
        <div className="flex items-center gap-2">
          <Maximize className="h-4 w-4 text-[#5C5C5C]" />
          <span className="text-[13px] font-[600] text-[#5C5C5C]">
            Đánh giá mức độ tổng thể:
          </span>
        </div>
        <span
          className={`rounded px-2.5 py-1 text-[13px] font-[800] ${severityStyle.color}`}
        >
          {severityStyle.label.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
