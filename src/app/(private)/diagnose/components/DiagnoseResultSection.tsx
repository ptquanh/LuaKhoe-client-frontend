import { ChevronRight, Maximize2, X } from "lucide-react";
import { useState } from "react";

import { AdvisorySectionView } from "./AdvisorySectionView";
import { DetectionResultsView } from "./DetectionResultsView";
import { parseDiagnoseResult } from "./diagnose.helper";
import { EmptyResultView } from "./EmptyResultView";
import { HealthyResultView } from "./HealthyResultView";
import { EnvAdjustmentView } from "./EnvAdjustmentView";

interface DiagnoseResultSectionProps {
  result: Record<string, any> | null;
}

export function DiagnoseResultSection({ result }: DiagnoseResultSectionProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const {
    hasResult,
    isHealthy,
    diseaseName,
    confidencePercent,
    severityStyle,
    resultsList,
    advisoryData,
    ragRecommendation,
    annotatedImage,
    envAdjustment,
    province,
    gpsLat,
    gpsLng,
    fieldParams,
  } = parseDiagnoseResult(result);

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#E0E0E0] bg-white">
      <div className="border-b border-[#E0E0E0] p-5">
        <h3 className="text-[18px] font-[600] text-[#1B1B1B]">
          Kết quả chẩn đoán
        </h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {!hasResult ? (
          <EmptyResultView />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* AI Detected Image Preview */}
            {annotatedImage && (
              <div className="mb-6 overflow-hidden rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-[13px] font-[600] text-[#5C5C5C]">
                    Ảnh phân tích AI
                  </span>
                  <span className="text-[12px] font-[500] text-[#2F9E44]">
                    Nhấn vào ảnh để phóng to
                  </span>
                </div>
                <div
                  className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-black/5"
                  onClick={() => setZoomedImage(annotatedImage)}
                >
                  <img
                    src={annotatedImage}
                    alt="AI Annotated"
                    className="max-h-[280px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 text-[13px] font-[500] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-4 w-4" /> Phóng to ảnh
                  </div>
                </div>
              </div>
            )}

            {/* Environmental Adjustment Module */}
            {envAdjustment && envAdjustment.applied && (
              <EnvAdjustmentView adjustment={envAdjustment} />
            )}

            {/* Metadata (Location & Field Params) */}
            {(province || fieldParams) && (
              <div className="mb-6 rounded-xl border border-[#E0E0E0] bg-[#F8F9FA] p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 border-b border-[#E0E0E0] pb-2 text-[14px] font-[600] text-[#1B1B1B]">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F9E44] text-white">
                    <Maximize2 className="h-3 w-3" />
                  </div>
                  Thông tin thực địa
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {province && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-[500] text-[#5C5C5C] uppercase tracking-wider">Vùng miền</span>
                      <span className="text-[13px] font-[600] text-[#1B1B1B]">{province}</span>
                      {gpsLat && gpsLng && (
                        <span className="text-[10px] text-[#5C5C5C]">
                          ({gpsLat.toFixed(4)}, {gpsLng.toFixed(4)})
                        </span>
                      )}
                    </div>
                  )}
                  {fieldParams && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-[500] text-[#5C5C5C] uppercase tracking-wider">Tình trạng ruộng</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="rounded-md bg-white border border-[#E0E0E0] px-2 py-0.5 text-[11px] font-[500] text-[#1B1B1B]">
                          {fieldParams.growth}
                        </span>
                        <span className="rounded-md bg-white border border-[#E0E0E0] px-2 py-0.5 text-[11px] font-[500] text-[#1B1B1B]">
                          Nước: {fieldParams.water}
                        </span>
                        {fieldParams.leafhopper && (
                          <span className="rounded-md bg-[#FFF3E0] border border-[#FFE0B2] px-2 py-0.5 text-[11px] font-[600] text-[#E65100]">
                            Có rầy nâu
                          </span>
                        )}
                        {fieldParams.fog && (
                          <span className="rounded-md bg-[#E3F2FD] border border-[#BBDEFB] px-2 py-0.5 text-[11px] font-[600] text-[#1565C0]">
                            Sương mù
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isHealthy ? (
              <HealthyResultView
                diseaseName={diseaseName}
                confidencePercent={confidencePercent}
              />
            ) : (
              <DetectionResultsView
                resultsList={resultsList}
                diseaseName={diseaseName}
                confidencePercent={confidencePercent}
                severityStyle={severityStyle}
                envAdjustment={envAdjustment}
              />
            )}

            {!isHealthy && (
              <>
                <AdvisorySectionView
                  advisoryData={advisoryData}
                  ragRecommendation={ragRecommendation}
                />

                <div className="mt-6 flex justify-end">
                  <button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#2F9E44] px-4 text-[14px] font-[500] text-[#2F9E44] transition-colors hover:bg-[#E6F4EA]">
                    Xem chi tiết phác đồ <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E0E0E0] px-4 py-3">
              <h4 className="text-[16px] font-[600] text-[#1B1B1B]">
                Ảnh phân tích chi tiết
              </h4>
              <button
                className="rounded-full p-1.5 text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5]"
                onClick={() => setZoomedImage(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex max-h-[calc(90vh-100px)] items-center justify-center overflow-auto p-4">
              <img
                src={zoomedImage}
                alt="Zoomed Annotated"
                className="max-h-[75vh] w-auto rounded-lg object-contain shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
