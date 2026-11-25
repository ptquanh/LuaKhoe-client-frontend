"use client";

import {
  CheckCircle2,
  Lightbulb,
  MessageSquareHeart,
  Send,
  Star,
} from "lucide-react";
import { useState } from "react";

import { DiseaseItem } from "@/services/disease.service";
import { FeedbackItem } from "@/types/feedback.type";

interface DiagnosisFeedbackCardProps {
  onSubmitFeedback: (
    /* eslint-disable no-unused-vars */
    rating: number,
    comment: string,
    actualDiseaseIds: string[],
    /* eslint-enable no-unused-vars */
  ) => void;
  existingFeedback?: FeedbackItem | null;
  diseases: DiseaseItem[];
  detectedDiseaseIds: string[];
}

const STAR_LABELS: Record<number, string> = {
  1: "Sai hoàn toàn",
  2: "Chưa chính xác",
  3: "Bình thường",
  4: "Tốt, hữu ích",
  5: "Rất tuyệt vời",
};

export function DiagnosisFeedbackCard({
  onSubmitFeedback,
  existingFeedback,
  diseases,
  detectedDiseaseIds,
}: DiagnosisFeedbackCardProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedDiseaseIds, setSelectedDiseaseIds] = useState<string[]>([]);

  const activeRating = existingFeedback?.rating || rating;
  const activeFeedbackText = existingFeedback
    ? existingFeedback.content || ""
    : feedbackText;
  const isSubmitted = Boolean(existingFeedback) || submitted;

  const sortedDiseases = [...diseases].sort((a, b) => {
    const aDetected = detectedDiseaseIds.includes(a.id);
    const bDetected = detectedDiseaseIds.includes(b.id);
    if (aDetected && !bDetected) return -1;
    if (!aDetected && bDetected) return 1;
    return a.name.localeCompare(b.name, "vi-VN");
  });

  const handleStarClick = (star: number) => {
    if (existingFeedback) return;
    setRating(star);
  };

  const handleSubmit = () => {
    if (existingFeedback || rating === 0) return;
    onSubmitFeedback(rating, feedbackText, selectedDiseaseIds);
    setSubmitted(true);
  };

  const toggleDisease = (id: string) => {
    setSelectedDiseaseIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const statusUpper = existingFeedback?.status?.toUpperCase();

  return (
    <section className="border-border bg-bg-card overflow-hidden rounded-2xl border p-5 shadow-xs">
      <div className="border-border mb-4 flex items-center gap-3 border-b pb-3.5">
        <div className="bg-accent-light text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <MessageSquareHeart className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="font-heading text-text-primary text-base font-bold">
            Đánh giá kết quả AI
          </h3>
          <p className="text-text-secondary text-xs">
            Phản hồi của bạn giúp mô hình nhận diện ngày càng chuẩn hơn
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Star Rating Row */}
        <div className="border-border bg-bg-subtle/60 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isLit = star <= (hoverRating || activeRating);
              return (
                <button
                  key={star}
                  type="button"
                  disabled={Boolean(existingFeedback)}
                  aria-label={`Đánh giá ${star} sao`}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => !existingFeedback && setHoverRating(star)}
                  onMouseLeave={() => !existingFeedback && setHoverRating(0)}
                  className={`flex min-h-10 min-w-10 items-center justify-center rounded-lg transition-transform focus:outline-none ${
                    existingFeedback
                      ? "cursor-default"
                      : "cursor-pointer hover:scale-110"
                  }`}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      isLit
                        ? "fill-amber-500 text-amber-500"
                        : "text-border-strong fill-none"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {activeRating > 0 && (
            <span className="text-accent text-xs font-bold sm:text-sm">
              {STAR_LABELS[activeRating]}
            </span>
          )}
        </div>

        {/* Interactive Form */}
        {activeRating > 0 && !isSubmitted && !existingFeedback && (
          <div className="animate-in slide-in-from-top-2 flex flex-col gap-3.5 duration-200">
            {activeRating <= 3 && (
              <div className="border-warning/35 bg-accent-light/50 text-text-primary flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed font-medium">
                <Lightbulb className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Chuyên gia sẽ xem xét lại mẫu ảnh này để hiệu chỉnh mô hình.
                  Vui lòng chọn bệnh thực tế hoặc mô tả thêm bên dưới:
                </p>
              </div>
            )}

            {sortedDiseases.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-xs font-semibold">
                  Bệnh thực tế trên ruộng (nếu khác kết quả AI):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sortedDiseases.map((d) => {
                    const isDetected = detectedDiseaseIds.includes(d.id);
                    const isSelected = selectedDiseaseIds.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDisease(d.id)}
                        className={`flex min-h-8 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                          isSelected
                            ? "border-amber-500 bg-amber-500 text-white"
                            : isDetected
                              ? "bg-bg-card text-accent hover:bg-accent-light/40 border-dashed border-amber-500"
                              : "border-border bg-bg-card text-text-secondary hover:bg-bg-hover"
                        }`}
                      >
                        {isDetected && !isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        )}
                        <span>{d.name}</span>
                        {isDetected && (
                          <span className="text-[10px] opacity-80">(AI)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-semibold">
                Nhận xét thêm{" "}
                <span className="text-text-muted font-normal">(Tùy chọn)</span>
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Ví dụ: Phát hiện thêm bệnh ở mép lá, hoặc phác đồ hiệu quả sau 3 ngày..."
                rows={3}
                className="border-border bg-bg-card text-text-primary placeholder:text-text-muted focus:border-primary w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed transition-colors focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary-hover flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-xs transition-colors"
            >
              <Send className="h-4 w-4" /> Gửi đánh giá
            </button>
          </div>
        )}

        {/* Submitted / Persisted Feedback */}
        {existingFeedback && (
          <div className="border-border bg-bg-subtle/60 space-y-2.5 rounded-xl border p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-text-primary text-xs font-bold">
                Phản hồi đã ghi nhận
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  statusUpper === "APPROVED"
                    ? "bg-primary-soft text-primary"
                    : statusUpper === "REJECTED"
                      ? "bg-error/15 text-error"
                      : "bg-accent-light text-accent"
                }`}
              >
                {statusUpper === "APPROVED"
                  ? "Đã duyệt"
                  : statusUpper === "REJECTED"
                    ? "Đã từ chối"
                    : "Chờ xử lý"}
              </span>
            </div>

            <p className="text-text-secondary text-xs leading-relaxed italic sm:text-sm">
              &quot;
              {activeFeedbackText || "Đánh giá chất lượng chẩn đoán AI"}&quot;
            </p>

            {existingFeedback.actualDiseases &&
              existingFeedback.actualDiseases.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
                  <span className="text-text-secondary font-semibold">
                    Bệnh thực tế:
                  </span>
                  {existingFeedback.actualDiseases.map((ad) => (
                    <span
                      key={ad.id}
                      className="bg-accent-light text-accent rounded-md px-2 py-0.5 text-[11px] font-semibold"
                    >
                      {ad.disease?.name}
                    </span>
                  ))}
                </div>
              )}

            {existingFeedback.adminResponse && (
              <div className="border-primary-border bg-primary-soft/55 mt-2 rounded-xl border border-dashed p-3 text-xs">
                <p className="text-primary mb-1 font-bold">
                  Phản hồi từ cán bộ chuyên môn:
                </p>
                <p className="text-text-primary italic">
                  &quot;{existingFeedback.adminResponse}&quot;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Optimistic Local Success */}
        {isSubmitted && !existingFeedback && (
          <div className="border-primary-border bg-primary-soft/60 rounded-xl border p-3.5">
            <p className="text-primary flex items-center gap-2 text-xs font-semibold sm:text-sm">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
              Cảm ơn đóng góp của bạn! Hệ thống đã ghi nhận đánh giá.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
