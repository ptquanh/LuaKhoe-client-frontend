import { Info, Maximize, Target } from "lucide-react";

import { getConfidencePercent, SeverityStyle } from "./diagnose.helper";

interface DetectionResultsViewProps {
  resultsList: any[];
  diseaseName: string;
  confidencePercent: number;
  severityStyle: SeverityStyle;
}

export function DetectionResultsView({
  resultsList,
  diseaseName,
  confidencePercent,
  severityStyle,
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
        } else {
          acc.push({
            name,
            confidence: current.confidence,
            color: current.color || "#FB8C00", // Default orange if color is missing
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
          },
        ];

  return (
    <div className="mb-6 space-y-4">
      {detections.map((det: any, i: number) => {
        const detPercent = getConfidencePercent(det.confidence);
        const detName = det.name;
        const color = det.color || "#FB8C00";

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
                <Info className="h-3.5 w-3.5" /> AI Phân tích
              </div>
            </div>

            {/* Disease Name */}
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-[20px] font-[700] text-[#E65100]">
                {detName}
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-[#F0F2F5] bg-[#FAFAFA] p-2.5">
              <span className="text-[12px] font-[500] text-[#5C5C5C]">
                Độ tin cậy:
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full border border-black/5 bg-[#E0E0E0] shadow-inner">
                <div
                  className="h-full border-r border-black/10 transition-all duration-500 ease-out"
                  style={{
                    width: `${detPercent}%`,
                    backgroundColor: "#FB8C00",
                  }}
                />
              </div>
              <span className="text-[13px] font-[700] text-[#1B1B1B]">
                {detPercent}%
              </span>
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
