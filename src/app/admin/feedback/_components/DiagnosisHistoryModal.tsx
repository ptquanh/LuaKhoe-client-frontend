"use client";

import { Collapse, Image, Modal, Progress, Tabs } from "antd";

import { LegacyRagRecommendation } from "@/components/diagnosis/LegacyRagRecommendation";

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
        <div className="py-8 text-center text-[var(--text-muted)]">
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
        <div className="flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
          {diagnosisData.originalImageUrl || diagnosisData.imageUrl ? (
            <Image
              src={diagnosisData.originalImageUrl || diagnosisData.imageUrl}
              alt="Ảnh gốc"
              className="object-contain"
              style={{ maxHeight: "380px", maxWidth: "100%" }}
              preview={{ mask: "Phóng to" }}
            />
          ) : (
            <div className="py-12 text-center text-[var(--text-muted)]">
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
        <div className="flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
          {diagnosisData.resultImageUrl ? (
            <Image
              src={diagnosisData.resultImageUrl}
              alt="Ảnh kết quả AI"
              className="object-contain"
              style={{ maxHeight: "380px", maxWidth: "100%" }}
              preview={{ mask: "Phóng to" }}
            />
          ) : (
            <div className="py-12 text-center text-[var(--text-muted)]">
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
        <span className="text-lg font-bold text-[var(--text-primary)]">
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

          <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4 text-[13px] text-[var(--text-secondary)]">
            <p className="tabular-nums">
              <strong className="text-[var(--text-primary)]">
                Thời gian quét:
              </strong>{" "}
              {new Date(diagnosisData.createdAt).toLocaleString("vi-VN")}
            </p>
            {diagnosisData.province && (
              <p>
                <strong className="text-[var(--text-primary)]">
                  Địa điểm:
                </strong>{" "}
                {diagnosisData.province}
              </p>
            )}
            {diagnosisData.envDescription && (
              <p>
                <strong className="text-[var(--text-primary)]">
                  Môi trường:
                </strong>{" "}
                {diagnosisData.envDescription}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: AI Results & RAG Guidelines */}
        <div className="space-y-5">
          {/* AI Confidences List */}
          <div>
            <h4 className="mb-3 text-[15px] font-semibold text-[var(--text-primary)]">
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
                        <span className="font-semibold text-[var(--text-primary)]">
                          {res.disease?.name || "Bệnh hại lúa"}
                        </span>
                        <span className="font-semibold text-[var(--primary)] tabular-nums">
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
              <p className="text-[13px] text-[var(--text-muted)]">
                Không phát hiện bệnh cụ thể nào.
              </p>
            )}
          </div>

          {/* RAG detailed collapse panel */}
          {diagnosisData.results && diagnosisData.results.length > 0 && (
            <div className="space-y-3">
              <h4 className="mb-2 text-[15px] font-semibold text-[var(--text-primary)]">
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
                        <span className="font-bold text-[var(--text-primary)]">
                          {res.disease?.name || "Bệnh hại lúa"}
                        </span>
                        <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)] tabular-nums">
                          Độ tin cậy: {displayPercent}%
                        </span>
                      </div>
                    ),
                    children: (
                      <div className="max-h-[300px] space-y-4 overflow-y-auto pr-1">
                        {/* Basic Treatment */}
                        {res.disease?.treatment && (
                          <div className="rounded-xl border border-dashed border-[var(--primary-border)] bg-[var(--primary-soft)]/50 p-3">
                            <strong className="mb-1 block text-xs text-[var(--primary)]">
                              Phác đồ khuyến nghị cơ bản:
                            </strong>
                            <p className="text-[13px] leading-relaxed whitespace-pre-line text-[var(--text-primary)]">
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
                          <p className="text-xs text-[var(--text-muted)] italic">
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
