"use client";

import { CheckCircle2, MessageSquareHeart, Send } from "lucide-react";
import { useEffect, useState } from "react";

import { DiseaseItem } from "@/services/disease.service";
import { FeedbackItem } from "@/types/feedback.type";

interface DiagnosisFeedbackCardProps {
  onSubmitFeedback: (
    rating: number,
    comment: string,
    actualDiseaseIds: string[],
  ) => void;
  existingFeedback?: FeedbackItem | null;
  diseases: DiseaseItem[];
  detectedDiseaseIds: string[];
}

const STAR_LABELS: Record<number, string> = {
  1: "⭐ Sai hoàn toàn",
  2: "⭐ Chưa chính xác",
  3: "⭐ Bình thường",
  4: "⭐ Tốt, hữu ích",
  5: "⭐ Rất tuyệt vời",
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

  useEffect(() => {
    if (existingFeedback) {
      setSubmitted(true);
      // Use normalized fields directly — no more string parsing
      if (existingFeedback.rating) {
        setRating(existingFeedback.rating);
      }
      setFeedbackText(existingFeedback.content || "");
    }
  }, [existingFeedback]);

  // Smart Sorting: AI-detected diseases first, then A-Z
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

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8E1] text-[#F57F17]">
          <MessageSquareHeart className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
            Đánh giá chất lượng chẩn đoán AI
          </h3>
          <p className="text-[13px] text-[#757575]">
            Ý kiến của bạn giúp hệ thống AI ngày càng chính xác hơn
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Star Rating Row */}
        <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-[#F7F7F7]/60 p-3.5">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={!!existingFeedback}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => !existingFeedback && setHoverRating(star)}
                onMouseLeave={() => !existingFeedback && setHoverRating(0)}
                className={`p-1 transition-transform focus:outline-none ${
                  existingFeedback
                    ? "cursor-default"
                    : "cursor-pointer hover:scale-115"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-[#FB8C00] text-[#FB8C00]"
                      : "fill-none text-[#E0E0E0]"
                  }`}
                  stroke="currentColor"
                  strokeWidth={star <= (hoverRating || rating) ? 0 : 1.5}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <span className="ml-3 text-[15px] font-[700] text-[#FB8C00]">
              {STAR_LABELS[rating]}
            </span>
          )}
        </div>

        {/* Form — always visible once a star is selected, hidden after submit */}
        {rating > 0 && !submitted && !existingFeedback && (
          <div className="animate-in slide-in-from-top-2 flex flex-col gap-4 duration-300">
            {/* Hint for low ratings */}
            {rating <= 3 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <p className="text-[13.5px] leading-[1.5] font-[500] text-amber-900">
                  💡 Chuyên gia nông nghiệp sẽ xem xét lại ảnh chẩn đoán để căn
                  chỉnh lại mô hình AI. Vui lòng mô tả chi tiết điểm chưa chính
                  xác:
                </p>
              </div>
            )}

            {/* Disease pills */}
            {sortedDiseases.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[13.5px] font-[600] text-[#5C5C5C]">
                  Chọn (các) bệnh thực tế bạn phát hiện trên ruộng (nếu có):
                </span>
                <div className="flex flex-wrap gap-2">
                  {sortedDiseases.map((d) => {
                    const isDetected = detectedDiseaseIds.includes(d.id);
                    const isSelected = selectedDiseaseIds.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDisease(d.id)}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-[600] shadow-sm transition-all duration-150 ${
                          isSelected
                            ? "border-[#FB8C00] bg-[#FB8C00] text-white"
                            : isDetected
                              ? "border-dashed border-[#FB8C00] bg-white text-[#FB8C00] hover:bg-[#FFF3E0]"
                              : "border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F5F5F5]"
                        }`}
                      >
                        {isDetected && !isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FB8C00]" />
                        )}
                        {d.name}
                        {isDetected && (
                          <span className="text-[10px] font-[500] opacity-80">
                            (AI đoán)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Textarea — always shown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#5C5C5C]">
                Nhận xét thêm{" "}
                <span className="font-[400] text-[#9E9E9E]">(Tùy chọn)</span>
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Ví dụ: Phát hiện thêm bệnh X ở góc phải, phác đồ điều trị chưa phù hợp với giống lúa địa phương..."
                rows={3}
                className="w-full resize-none rounded-xl border border-[#E0E0E0] px-4 py-3 text-[14px] leading-[1.6] text-[#1B1B1B] transition-colors focus:border-[#2F9E44] focus:outline-none"
              />
            </div>

            {/* Submit button — enabled as long as rating > 0 */}
            <button
              type="button"
              onClick={handleSubmit}
              className="flex h-10 w-fit cursor-pointer items-center gap-2 rounded-xl bg-[#2F9E44] px-5 text-[14px] font-[600] text-white shadow-sm transition-colors hover:bg-[#1F6F2E]"
            >
              <Send className="h-4 w-4" /> Gửi đánh giá
            </button>
          </div>
        )}

        {/* Existing feedback display */}
        {existingFeedback && (
          <div className="animate-in slide-in-from-top-2 mt-2 rounded-xl border border-[#E0E0E0] bg-[#F8F9FA] p-4 duration-300">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[14px] font-[600] text-[#1B1B1B]">
                Nội dung phản hồi của bạn:
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-[600] ${
                  existingFeedback.status?.toUpperCase() === "APPROVED"
                    ? "bg-[#E6F4EA] text-[#1F6F2E]"
                    : existingFeedback.status?.toUpperCase() === "REJECTED"
                      ? "bg-[#FFEBEE] text-[#C62828]"
                      : "bg-[#FFF8E1] text-[#F57F17]"
                }`}
              >
                {existingFeedback.status?.toUpperCase() === "APPROVED"
                  ? "Đã duyệt"
                  : existingFeedback.status?.toUpperCase() === "REJECTED"
                    ? "Đã từ chối"
                    : "Chờ xử lý"}
              </span>
            </div>
            <p className="mb-1 text-[14px] leading-[1.6] text-[#5C5C5C] italic">
              &quot;{feedbackText || "Đánh giá chất lượng chẩn đoán AI"}&quot;
            </p>

            {existingFeedback.actualDiseases &&
              existingFeedback.actualDiseases.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px]">
                  <span className="font-[600] text-[#757575]">
                    Bệnh thực tế đã báo:
                  </span>
                  {existingFeedback.actualDiseases.map((ad) => (
                    <span
                      key={ad.id}
                      className="rounded bg-[#FFE0B2] px-2.5 py-0.5 font-[600] text-[#E65100]"
                    >
                      {ad.disease?.name}
                    </span>
                  ))}
                </div>
              )}

            {existingFeedback.adminResponse && (
              <div className="mt-3 rounded-lg border border-dashed border-[#2F9E44]/20 bg-[#E6F4EA]/40 p-3.5 text-[13px]">
                <p className="mb-1 font-[700] text-[#1F6F2E]">
                  Cán bộ chuyên môn phản hồi:
                </p>
                <p className="text-[#2E7D32] italic">
                  &quot;{existingFeedback.adminResponse}&quot;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Success state after local submit */}
        {submitted && !existingFeedback && (
          <div className="animate-in slide-in-from-top-2 rounded-xl border border-[#2F9E44]/30 bg-[#E6F4EA] p-4 duration-300">
            <p className="flex items-center gap-2.5 text-[15px] font-[600] text-[#1F6F2E]">
              <CheckCircle2 className="h-5 w-5 text-[#2F9E44]" />
              Cảm ơn đóng góp của bạn! Chúng tôi đã ghi nhận phản hồi để nâng
              cấp AI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
