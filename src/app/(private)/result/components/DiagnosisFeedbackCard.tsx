"use client";

import { CheckCircle2, MessageSquareHeart, Send, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { FeedbackItem } from "@/types/feedback.type";

interface DiagnosisFeedbackCardProps {
  onSubmitFeedback: (rating: number, comment: string) => void;
  existingFeedback?: FeedbackItem | null;
}

export function DiagnosisFeedbackCard({
  onSubmitFeedback,
  existingFeedback,
}: DiagnosisFeedbackCardProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (existingFeedback) {
      setSubmitted(true);
      const msg = existingFeedback.userMessage || "";
      const match = msg.match(/\[Đánh giá: (\d+)\/5 sao\]/);
      if (match) {
        setRating(Number(match[1]));
        setFeedbackText(msg.replace(match[0], "").trim());
      } else if (msg.includes("tích cực") || msg.includes("5/5")) {
        setRating(5);
        setFeedbackText(msg);
      } else {
        setRating(5);
        setFeedbackText(msg);
      }
    }
  }, [existingFeedback]);

  const handleStarClick = (rate: number) => {
    if (existingFeedback) return;
    setRating(rate);
    setSubmitted(false);
    if (rate >= 4) {
      onSubmitFeedback(rate, "Đánh giá tích cực");
      setSubmitted(true);
    }
  };

  const handleSend = () => {
    if (existingFeedback) return;
    onSubmitFeedback(rating, feedbackText);
    setSubmitted(true);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white p-6 shadow-sm transition-all hover:shadow-md">
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
                className={`p-1 transition-transform focus:outline-none ${existingFeedback ? "cursor-default" : "cursor-pointer hover:scale-115"}`}
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-[#FB8C00] text-[#FB8C00]"
                      : "text-[#E0E0E0]"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <span className="ml-3 text-[15px] font-[700] text-[#FB8C00]">
              {rating === 5 && "⭐ Rất tuyệt vời"}
              {rating === 4 && "⭐ Tốt, hữu ích"}
              {rating === 3 && "⭐ Bình thường"}
              {rating === 2 && "⭐ Chưa chính xác"}
              {rating === 1 && "⭐ Sai hoàn toàn"}
            </span>
          )}
        </div>

        {rating > 0 && rating <= 3 && !submitted && !existingFeedback && (
          <div className="animate-in slide-in-from-top-2 flex flex-col gap-3 duration-300">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <p className="text-[13.5px] leading-[1.5] font-[500] text-amber-900">
                💡 Chuyên gia nông nghiệp sẽ xem xét lại ảnh chẩn đoán của bạn
                để căn chỉnh lại mô hình AI. Vui lòng mô tả chi tiết điểm chưa
                chính xác:
              </p>
            </div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Ví dụ: Lúa bị nhầm với bệnh khác, hoặc phác đồ chưa phù hợp..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[#E0E0E0] px-4 py-3 text-[14px] leading-[1.6] text-[#1B1B1B] transition-colors focus:border-[#2F9E44] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!feedbackText.trim()}
              className="flex h-10 w-fit cursor-pointer items-center gap-2 rounded-xl bg-[#2F9E44] px-5 text-[14px] font-[600] text-white shadow-sm transition-colors hover:bg-[#1F6F2E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> Gửi phản hồi
            </button>
          </div>
        )}

        {existingFeedback && (
          <div className="animate-in slide-in-from-top-2 mt-2 rounded-xl border border-[#E0E0E0] bg-[#F8F9FA] p-4 duration-300">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[14px] font-[600] text-[#1B1B1B]">
                Nội dung phản hồi của bạn:
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-[600] ${
                  existingFeedback.status === "ACCEPTED"
                    ? "bg-[#E6F4EA] text-[#1F6F2E]"
                    : existingFeedback.status === "REJECTED"
                      ? "bg-[#FFEBEE] text-[#C62828]"
                      : "bg-[#FFF8E1] text-[#F57F17]"
                }`}
              >
                {existingFeedback.status === "ACCEPTED"
                  ? "Đã duyệt"
                  : existingFeedback.status === "REJECTED"
                    ? "Đã từ chối"
                    : "Chờ xử lý"}
              </span>
            </div>
            <p className="text-[14px] leading-[1.6] text-[#5C5C5C] italic">
              &quot;{feedbackText || "Đánh giá chất lượng chẩn đoán AI"}&quot;
            </p>
          </div>
        )}

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
