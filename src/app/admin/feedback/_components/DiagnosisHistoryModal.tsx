"use client";

import { LegacyRagRecommendation } from "@/components/diagnosis/LegacyRagRecommendation";
import { Collapse, Image, Modal, Progress, Tabs } from "antd";

export interface DiagnosisResult {
  confidence: number;
  disease: {
    id: string;
    name: string;
    description?: string;
    treatment?: string;
  };
  advisory?: any;
}

export interface DiagnosisData {
  id: string;
  imageUrl?: string;
  originalImageUrl?: string;
  resultImageUrl?: string;
  createdAt: string;
  results: DiagnosisResult[];
  province?: string | null;
  envDescription?: string | null;
}

interface DiagnosisHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosisData: DiagnosisData | null;
}

export default function DiagnosisHistoryModal({
  isOpen,
  onClose,
  diagnosisData,
}: DiagnosisHistoryModalProps) {
  if (!diagnosisData) {
    return (
      <Modal
        title="Lịch sử Chẩn đoán & Gợi ý RAG"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={900}
        centered
        styles={{
          body: {
            maxHeight: "75vh",
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
      >
        <div className="py-8 text-center text-[#9E9E9E]">
          Đang tải thông tin...
        </div>
      </Modal>
    );
  }

  const imageTabItems = [
    {
      key: "original",
      label: "Ảnh gốc",
      children: (
        <div className="flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-xl border border-[#E0E0E0] bg-[#FAFAFA]">
          {diagnosisData.originalImageUrl || diagnosisData.imageUrl ? (
            <Image
              src={diagnosisData.originalImageUrl || diagnosisData.imageUrl}
              alt="Ảnh gốc"
              className="object-contain"
              style={{ maxHeight: "380px", maxWidth: "100%" }}
              preview={{ mask: "Phóng to" }}
            />
          ) : (
            <div className="py-12 text-center text-[#9E9E9E]">
              Không có ảnh gốc
            </div>
          )}
        </div>
      ),
    },
    {
      key: "result",
      label: "Ảnh kết quả AI",
      children: (
        <div className="flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-xl border border-[#E0E0E0] bg-[#FAFAFA]">
          {diagnosisData.resultImageUrl ? (
            <Image
              src={diagnosisData.resultImageUrl}
              alt="Ảnh kết quả AI"
              className="object-contain"
              style={{ maxHeight: "380px", maxWidth: "100%" }}
              preview={{ mask: "Phóng to" }}
            />
          ) : (
            <div className="py-12 text-center text-[#9E9E9E]">
              Không có ảnh kết quả (Không phát hiện bệnh hoặc chưa vẽ box)
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <span className="text-[18px] font-[700] text-[#1B1B1B]">
          Lịch sử Chẩn đoán & Gợi ý RAG
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      styles={{
        body: {
          maxHeight: "75vh",
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
    >
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column: Image Area with Tabs */}
        <div className="space-y-4">
          <Image.PreviewGroup>
            <Tabs defaultActiveKey="original" items={imageTabItems} />
          </Image.PreviewGroup>

          <div className="space-y-2 rounded-lg border border-[#F0F2F5] bg-[#FAFAFA] p-4 text-[13px] text-[#5C5C5C]">
            <p>
              <strong className="text-[#333333]">Thời gian quét:</strong>{" "}
              {new Date(diagnosisData.createdAt).toLocaleString("vi-VN")}
            </p>
            {diagnosisData.province && (
              <p>
                <strong className="text-[#333333]">Địa điểm:</strong>{" "}
                {diagnosisData.province}
              </p>
            )}
            {diagnosisData.envDescription && (
              <p>
                <strong className="text-[#333333]">Môi trường:</strong>{" "}
                {diagnosisData.envDescription}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: AI Results & RAG Guidelines */}
        <div className="space-y-5">
          {/* AI Confidences List */}
          <div>
            <h4 className="mb-3 text-[15px] font-[600] text-[#1B1B1B]">
              Kết quả dự đoán AI:
            </h4>
            {diagnosisData.results && diagnosisData.results.length > 0 ? (
              <div className="space-y-3">
                {diagnosisData.results.map((res, idx) => {
                  const confidenceVal = Number(res.confidence);
                  const displayPercent =
                    confidenceVal <= 1
                      ? Math.round(confidenceVal * 100)
                      : Math.round(confidenceVal);

                  return (
                    <div key={res.disease?.id || idx} className="space-y-1">
                      <div className="flex justify-between text-[13px]">
                        <span className="font-[600] text-[#333333]">
                          {res.disease?.name || "Bệnh hại lúa"}
                        </span>
                        <span className="font-[600] text-[#2E7D32]">
                          {displayPercent}%
                        </span>
                      </div>
                      <Progress
                        percent={displayPercent}
                        strokeColor={
                          displayPercent >= 80
                            ? "#2E7D32"
                            : displayPercent >= 50
                              ? "#FB8C00"
                              : "#E53935"
                        }
                        showInfo={false}
                        status="active"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-[#9E9E9E]">
                Không phát hiện bệnh cụ thể nào.
              </p>
            )}
          </div>

          {/* RAG detailed collapse panel */}
          {diagnosisData.results && diagnosisData.results.length > 0 && (
            <div className="space-y-3">
              <h4 className="mb-2 text-[15px] font-[600] text-[#1B1B1B]">
                Gợi ý dinh dưỡng & Điều trị chi tiết:
              </h4>
              <Collapse
                defaultActiveKey={["0"]}
                items={diagnosisData.results.map((res, idx) => {
                  const confidenceVal = Number(res.confidence);
                  const displayPercent =
                    confidenceVal <= 1
                      ? Math.round(confidenceVal * 100)
                      : Math.round(confidenceVal);

                  return {
                    key: String(idx),
                    label: (
                      <div className="flex w-full items-center justify-between pr-4">
                        <span className="font-[700] text-[#1B1B1B]">
                          {res.disease?.name || "Bệnh hại lúa"}
                        </span>
                        <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[12px] font-[600] text-[#2E7D32]">
                          Độ tin cậy: {displayPercent}%
                        </span>
                      </div>
                    ),
                    children: (
                      <div className="max-h-[300px] space-y-4 overflow-y-auto pr-1">
                        {/* Basic Treatment */}
                        {res.disease?.treatment && (
                          <div className="rounded-lg border border-dashed border-[#2F9E44]/30 bg-[#E6F4EA]/20 p-3">
                            <strong className="mb-1 block text-[12.5px] text-[#2E7D32]">
                              Phác đồ khuyến nghị cơ bản:
                            </strong>
                            <p className="text-[13px] leading-[1.5] whitespace-pre-line text-[#424242]">
                              {res.disease.treatment}
                            </p>
                          </div>
                        )}

                        {/* RAG Advisory */}
                        {res.advisory ? (
                          <LegacyRagRecommendation
                            recommendation={res.advisory}
                          />
                        ) : (
                          <p className="text-[12px] text-[#9E9E9E] italic">
                            Không có hướng dẫn tư vấn RAG chi tiết cho bệnh hại
                            này.
                          </p>
                        )}
                      </div>
                    ),
                  };
                })}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
