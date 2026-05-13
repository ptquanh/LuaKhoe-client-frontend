import React from "react";
import {
  Search,
  Info,
  Maximize,
  Droplets,
  Leaf,
  Sun,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

interface DiagnoseResultSectionProps {
  result: any;
}

export function DiagnoseResultSection({ result }: DiagnoseResultSectionProps) {
  const isHealthy = result?.disease_key === "Healthy";

  const getSeverityStyle = (severity: string) => {
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
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#E0E0E0] bg-white">
      <div className="border-b border-[#E0E0E0] p-5">
        <h3 className="text-[18px] font-[600] text-[#1B1B1B]">
          Kết quả chẩn đoán
        </h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {!result ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F2F5]">
              <Search className="h-8 w-8 text-[#9E9E9E]" />
            </div>
            <p className="max-w-[200px] text-[14px] text-[#5C5C5C]">
              Kết quả sẽ hiển thị tại đây sau khi bạn tải ảnh lên
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isHealthy ? (
              <div className="mb-6 rounded-xl border border-[#2F9E44]/30 bg-[#E6F4EA] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] font-[600] tracking-wider text-[#5C5C5C] uppercase">
                    Tình trạng
                  </span>
                  <div className="rounded border border-[#A5D6A7] bg-[#E6F4EA] px-2 py-0.5 text-[12px] font-[600] text-[#2F9E44]">
                    ✅ Khỏe mạnh
                  </div>
                </div>
                <h2 className="mb-3 text-[24px] font-[700] text-[#1F6F2E]">
                  {result.disease_name}
                </h2>
                <div className="flex items-center gap-3 rounded-lg bg-white/60 p-3">
                  <span className="text-[13px] font-[500] text-[#5C5C5C]">
                    Độ chính xác:
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E0E0E0]">
                    <div
                      className="h-full bg-[#2F9E44]"
                      style={{
                        width: `${Math.round(result.confidence * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[14px] font-[700] text-[#1B1B1B]">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-6 space-y-4">
                {(result.detections && result.detections.length > 0
                  ? result.detections
                  : [
                      {
                        disease: result.disease_name,
                        confidence: result.confidence,
                      },
                    ]
                ).map((det: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm transition-all hover:border-[#FB8C00]/30"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-[600] tracking-wider text-[#9E9E9E] uppercase">
                        Phát hiện #{i + 1}
                      </span>
                      <div className="flex items-center gap-1.5 text-[12px] font-[600] text-[#FB8C00]">
                        <Info className="h-3.5 w-3.5" /> AI Phân tích
                      </div>
                    </div>
                    <h2 className="mb-3 text-[20px] font-[700] text-[#E65100]">
                      {det.disease}
                    </h2>
                    <div className="flex items-center gap-3 rounded-lg border border-[#F0F2F5] bg-[#FAFAFA] p-2.5">
                      <span className="text-[12px] font-[500] text-[#5C5C5C]">
                        Độ tin cậy:
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E0E0E0]">
                        <div
                          className="h-full bg-[#FB8C00]"
                          style={{
                            width: `${Math.round(det.confidence * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[13px] font-[700] text-[#1B1B1B]">
                        {Math.round(det.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}

                {/* Overall Severity Assessment */}
                <div
                  className={`flex items-center justify-between rounded-lg border p-3 shadow-sm ${
                    getSeverityStyle(result.severity).bg
                  } ${getSeverityStyle(result.severity).border}`}
                >
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-[#5C5C5C]" />
                    <span className="text-[13px] font-[600] text-[#5C5C5C]">
                      Đánh giá mức độ tổng thể:
                    </span>
                  </div>
                  <span
                    className={`rounded px-2.5 py-1 text-[13px] font-[800] ${
                      getSeverityStyle(result.severity).color
                    }`}
                  >
                    {getSeverityStyle(result.severity).label.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {!isHealthy && (
              <div className="space-y-5">
                {result.rag_recommendation ? (
                  <div className="space-y-4">
                    {/* Immediate Actions */}
                    {result.rag_recommendation.immediate_actions &&
                      result.rag_recommendation.immediate_actions.length >
                        0 && (
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
                            <CheckCircle className="h-4 w-4 text-[#2F9E44]" />{" "}
                            Hành động khẩn cấp
                          </h4>
                          <ul className="space-y-2 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
                            {result.rag_recommendation.immediate_actions.map(
                              (item: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex gap-2 text-[14px] leading-[1.5] text-[#5C5C5C]"
                                >
                                  <span className="mt-0.5 text-[#E53935]">
                                    •
                                  </span>{" "}
                                  <span>{item}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Treatment Protocol */}
                    {result.rag_recommendation.treatment_protocol && (
                      <div>
                        <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
                          <Droplets className="h-4 w-4 text-[#2F9E44]" /> Phác
                          đồ điều trị
                        </h4>
                        <div className="space-y-3 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
                          {result.rag_recommendation.treatment_protocol
                            .chemical &&
                            result.rag_recommendation.treatment_protocol
                              .chemical !==
                              "Không có dữ liệu trong tài liệu tham khảo" && (
                              <div>
                                <strong className="text-[13px] text-[#1B1B1B]">
                                  Hóa học:
                                </strong>
                                <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                                  {
                                    result.rag_recommendation.treatment_protocol
                                      .chemical
                                  }
                                </p>
                              </div>
                            )}
                          {result.rag_recommendation.treatment_protocol
                            .biological &&
                            result.rag_recommendation.treatment_protocol
                              .biological !==
                              "Không có dữ liệu trong tài liệu tham khảo" && (
                              <div>
                                <strong className="text-[13px] text-[#1B1B1B]">
                                  Sinh học:
                                </strong>
                                <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                                  {
                                    result.rag_recommendation.treatment_protocol
                                      .biological
                                  }
                                </p>
                              </div>
                            )}
                          {result.rag_recommendation.treatment_protocol
                            .cultural &&
                            result.rag_recommendation.treatment_protocol
                              .cultural !==
                              "Không có dữ liệu trong tài liệu tham khảo" && (
                              <div>
                                <strong className="text-[13px] text-[#1B1B1B]">
                                  Canh tác:
                                </strong>
                                <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                                  {
                                    result.rag_recommendation.treatment_protocol
                                      .cultural
                                  }
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {/* NPK Adjustment */}
                    {result.rag_recommendation.npk_adjustment &&
                      result.rag_recommendation.npk_adjustment !==
                        "Không có dữ liệu trong tài liệu tham khảo" && (
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
                            <Leaf className="h-4 w-4 text-[#2F9E44]" /> Điều
                            chỉnh dinh dưỡng (NPK)
                          </h4>
                          <p className="rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3 text-[14px] leading-[1.6] text-[#5C5C5C]">
                            {result.rag_recommendation.npk_adjustment}
                          </p>
                        </div>
                      )}

                    {/* Prevention Measures */}
                    {result.rag_recommendation.prevention_measures &&
                      result.rag_recommendation.prevention_measures.length >
                        0 && (
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
                            <Sun className="h-4 w-4 text-[#2F9E44]" /> Biện pháp
                            phòng ngừa
                          </h4>
                          <ul className="space-y-2 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
                            {result.rag_recommendation.prevention_measures.map(
                              (item: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex gap-2 text-[14px] leading-[1.5] text-[#5C5C5C]"
                                >
                                  <span className="mt-0.5 text-[#2F9E44]">
                                    •
                                  </span>{" "}
                                  <span>{item}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] p-6 text-center">
                    <Info className="mb-2 h-8 w-8 text-[#9E9E9E]" />
                    <p className="text-[14px] text-[#5C5C5C]">
                      Không có hướng dẫn chi tiết cho bệnh này hoặc kết nối hệ
                      thống AI đang bị lỗi.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#2F9E44] px-4 text-[14px] font-[500] text-[#2F9E44] transition-colors hover:bg-[#E6F4EA]">
                Xem chi tiết phác đồ <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
