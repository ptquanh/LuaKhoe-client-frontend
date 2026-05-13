"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle,
  Star,
  Send,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ROUTES } from "@/constants/routes";

const diseaseImg =
  "https://images.unsplash.com/photo-1634641568774-1906553ade90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGxhbnQlMjBkaXNlYXNlJTIwbGVhZiUyMGJyb3duJTIwc3BvdHxlbnwxfHx8fDE3NzMzNzA3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080";

const confidenceData = [
  { name: "Confidence", value: 92 },
  { name: "Remaining", value: 8 },
];

const severityColors: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  low: { bg: "#E6F4EA", text: "#2E7D32", label: "Nhẹ" },
  medium: { bg: "#FFF8E1", text: "#F57F17", label: "Trung bình" },
  high: { bg: "#FFF3E0", text: "#E65100", label: "Nặng" },
  critical: { bg: "#FFEBEE", text: "#C62828", label: "Nghiêm trọng" },
};

const mockResult = {
  disease: "Bệnh đạo ôn (Blast Disease)",
  severity: "high" as const,
  confidence: 92,
  urgentActions: [
    "Phun thuốc Tricyclazole 75WP ngay hôm nay (0.3kg/ha)",
    "Rút bớt nước ruộng, để ruộng khô 3-5 ngày",
    "Loại bỏ lá bệnh nặng và tiêu hủy",
  ],
  treatments: {
    chemical: [
      "Phun Tricyclazole 75WP liều 0.3kg/ha khi phát hiện bệnh",
      "Kết hợp Isoprothiolane 40EC phun phòng 2 lần cách nhau 7-10 ngày",
      "Phun vào sáng sớm hoặc chiều mát, tránh trời nắng gắt",
    ],
    biological: [
      "Sử dụng chế phẩm sinh học Trichoderma harzianum (10^8 bào tử/ml) phun định kỳ 7 ngày/lần",
      "Kết hợp Bacillus subtilis để tăng khả năng đề kháng",
      "Thay đổi lượng nước tưới để giảm độ ẩm vi sinh trong ruộng",
    ],
    cultivation: [
      "Giảm lượng đạm bón xuống 20%, tăng kali để tăng sức đề kháng",
      "Rút nước ruộng định kỳ, tránh úng nước kéo dài",
      "Loại bỏ tàn dư rơm rạ sau thu hoạch để giảm nguồn bệnh",
      "Luân canh với cây họ đậu hoặc ngô trong vụ tới",
    ],
  },
  npk: {
    current: "Đã bón quá nhiều đạm (N), thiếu kali (K)",
    recommendation:
      "Giảm đạm xuống 80kg N/ha, tăng kali lên 60kg K₂O/ha, giữ lân ở mức 40kg P₂O₅/ha",
  },
  prevention:
    "Chọn giống kháng bệnh (OM6976, Jasmine), không bón thừa đạm, luân canh hợp lý",
  sources: "Sở NN&PTNT Đồng bằng sông Cửu Long, IRRI Rice Knowledge Bank",
  confidenceNote:
    "Độ tin cậy 92%. Nếu triệu chứng không cải thiện sau 7 ngày, hãy liên hệ khuyến nông địa phương.",
};

const sev = severityColors[mockResult.severity];

export default function ResultPage() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [checkedActions, setCheckedActions] = useState<boolean[]>(
    mockResult.urgentActions.map(() => false),
  );

  const toggleCheck = (index: number) => {
    setCheckedActions((prev) =>
      prev.map((val, i) => (i === index ? !val : val)),
    );
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    setFeedbackSubmitted(false);
  };

  const handleSubmitFeedback = () => {
    console.log("Feedback submitted:", { rating, feedbackText });
    setFeedbackSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-[900px] pb-20">
      <button
        onClick={() => router.push(ROUTES.DIAGNOSE)}
        className="mb-4 flex cursor-pointer items-center gap-1 text-[14px] text-[#5C5C5C] hover:text-[#1B1B1B]"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </button>

      <div className="space-y-5">
        {/* Hero Card - Disease Name + Severity */}
        <div
          className="rounded-xl border-2 p-6"
          style={{ backgroundColor: sev.bg, borderColor: sev.text }}
        >
          <div className="mb-1 flex items-start justify-between">
            <span
              className="inline-block h-7 rounded-md px-3 text-[13px] leading-[28px] font-[600]"
              style={{ backgroundColor: sev.text, color: "white" }}
            >
              {sev.label.toUpperCase()}
            </span>
            {/* Confidence Donut */}
            <div className="relative h-16 w-16 shrink-0">
              <PieChart width={64} height={64}>
                <Pie
                  data={confidenceData}
                  cx={32}
                  cy={32}
                  innerRadius={22}
                  outerRadius={30}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#2F9E44" />
                  <Cell fill="#E0E0E0" />
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[12px] font-[700] text-[#2F9E44]">
                  {mockResult.confidence}%
                </span>
              </div>
            </div>
          </div>
          <h1 className="text-[28px] leading-[1.2] font-[700] text-[#1B1B1B]">
            {mockResult.disease}
          </h1>
        </div>

        {/* Urgent To-Do Checklist */}
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-5">
          <h3 className="mb-3 text-[18px] font-[700] text-[#1B1B1B]">
            Việc cần làm ngay hôm nay
          </h3>
          <div className="space-y-2.5">
            {mockResult.urgentActions.map((action, i) => (
              <label
                key={i}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#E0E0E0] p-3 transition-colors hover:bg-[#F7F7F7]"
              >
                <input
                  type="checkbox"
                  checked={checkedActions[i]}
                  onChange={() => toggleCheck(i)}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-[#E0E0E0] text-[#2F9E44] focus:ring-[#2F9E44]"
                />
                <span
                  className={`text-[15px] leading-[1.5] ${checkedActions[i] ? "text-[#9E9E9E] line-through" : "text-[#1B1B1B]"}`}
                >
                  {action}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Treatment Plans - Accordion */}
        <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
          <div className="border-b border-[#E0E0E0] px-5 py-4">
            <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
              Phác đồ điều trị
            </h3>
            <p className="mt-1 text-[13px] text-[#5C5C5C]">
              Chọn phương pháp phù hợp với điều kiện ruộng của bạn
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="chemical"
              className="border-b border-[#E0E0E0]"
            >
              <AccordionTrigger className="px-5 py-4 text-[15px] font-[600] text-[#1B1B1B] hover:bg-[#F7F7F7]">
                🧪 Hóa học (Nhanh, hiệu quả cao)
              </AccordionTrigger>
              <AccordionContent className="px-5 pt-1 pb-4">
                <ol className="space-y-2">
                  {mockResult.treatments.chemical.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[14px] leading-[1.5] text-[#5C5C5C]"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] text-[12px] font-[600] text-[#2F9E44]">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="biological"
              className="border-b border-[#E0E0E0]"
            >
              <AccordionTrigger className="px-5 py-4 text-[15px] font-[600] text-[#1B1B1B] hover:bg-[#F7F7F7]">
                🌱 Sinh học (An toàn, bền vững)
              </AccordionTrigger>
              <AccordionContent className="px-5 pt-1 pb-4">
                <ol className="space-y-2">
                  {mockResult.treatments.biological.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[14px] leading-[1.5] text-[#5C5C5C]"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] text-[12px] font-[600] text-[#2F9E44]">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cultivation">
              <AccordionTrigger className="px-5 py-4 text-[15px] font-[600] text-[#1B1B1B] hover:bg-[#F7F7F7]">
                🚜 Canh tác (Phòng ngừa lâu dài)
              </AccordionTrigger>
              <AccordionContent className="px-5 pt-1 pb-4">
                <ol className="space-y-2">
                  {mockResult.treatments.cultivation.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[14px] leading-[1.5] text-[#5C5C5C]"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] text-[12px] font-[600] text-[#2F9E44]">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* NPK Nutritions Box */}
        <div className="rounded-xl border-2 border-[#2F9E44] bg-[#E6F4EA] p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F9E44]">
              <span className="text-[16px] font-[700] text-white">N-P-K</span>
            </div>
            <h3 className="text-[16px] font-[700] text-[#1F6F2E]">
              Điều chỉnh dinh dưỡng
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-[14px] text-[#1B1B1B]">
              <span className="font-[600]">Tình trạng hiện tại:</span>{" "}
              {mockResult.npk.current}
            </p>
            <p className="text-[14px] text-[#1B1B1B]">
              <span className="font-[600]">Khuyến nghị:</span>{" "}
              {mockResult.npk.recommendation}
            </p>
          </div>
        </div>

        {/* Prevention for Next Season */}
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-5">
          <h3 className="mb-2 text-[16px] font-[600] text-[#1B1B1B]">
            Phòng ngừa vụ sau
          </h3>
          <p className="text-[14px] leading-[1.5] text-[#5C5C5C]">
            {mockResult.prevention}
          </p>
        </div>

        {/* Image Preview */}
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-4">
          <ImageWithFallback
            src={diseaseImg}
            alt="Uploaded"
            className="max-h-[320px] w-full rounded-lg border border-[#E0E0E0] object-cover"
          />
          <div className="mt-3 flex gap-2">
            <button className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#E0E0E0] px-4 text-[13px] text-[#5C5C5C] hover:bg-[#F0F2F5]">
              <Download className="h-4 w-4" /> Tải ảnh
            </button>
            <button className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#E0E0E0] px-4 text-[13px] text-[#5C5C5C] hover:bg-[#F0F2F5]">
              <Share2 className="h-4 w-4" /> Chia sẻ
            </button>
          </div>
        </div>

        {/* Feedback with Star Rating */}
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-5">
          <h4 className="mb-3 text-[15px] font-[600] text-[#1B1B1B]">
            Kết quả chẩn đoán có chính xác và hữu ích không?
          </h4>

          {/* Star Rating */}
          <div className="mb-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer transition-transform hover:scale-110"
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
            {rating > 0 && (
              <span className="ml-2 text-[14px] font-[500] text-[#5C5C5C]">
                {rating === 5
                  ? "Rất tốt"
                  : rating === 4
                    ? "Tốt"
                    : rating === 3
                      ? "Tạm được"
                      : rating === 2
                        ? "Chưa tốt"
                        : "Không chính xác"}
              </span>
            )}
          </div>

          {/* Conditional Text Area for Low Ratings (1-3 stars) */}
          {rating > 0 && rating <= 3 && (
            <div className="animate-in slide-in-from-top-2 space-y-3 duration-300">
              <div className="rounded-lg border border-[#FB8C00]/30 bg-[#FFF8E1] p-3">
                <p className="text-[13px] leading-[1.5] text-[#F57F17]">
                  💡 Vui lòng cho chúng tôi biết vấn đề để cải thiện hệ thống AI
                </p>
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Vui lòng mô tả chi tiết:&#10;• AI có nhận diện sai bệnh không?&#10;• Phác đồ điều trị có phù hợp không?&#10;• Lời khuyên có thiếu sót gì không?"
                rows={4}
                className="w-full resize-none rounded-lg border border-[#E0E0E0] px-4 py-3 text-[14px] leading-[1.6] focus:border-[#2F9E44] focus:outline-none"
              />
              <button
                onClick={handleSubmitFeedback}
                disabled={!feedbackText.trim()}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-5 text-[14px] font-[500] text-white transition-colors hover:bg-[#1F6F2E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> Gửi phản hồi
              </button>
            </div>
          )}

          {/* Success Message */}
          {feedbackSubmitted && (
            <div className="animate-in slide-in-from-top-2 mt-3 rounded-lg border border-[#2F9E44]/30 bg-[#E6F4EA] p-3 duration-300">
              <p className="flex items-center gap-2 text-[14px] text-[#1F6F2E]">
                <CheckCircle className="h-4 w-4" />
                Cảm ơn phản hồi của bạn! Chuyên gia sẽ xem xét để cải thiện hệ
                thống.
              </p>
            </div>
          )}

          {rating >= 4 && (
            <div className="animate-in slide-in-from-top-2 mt-3 rounded-lg border border-[#2F9E44]/30 bg-[#E6F4EA] p-3 duration-300">
              <p className="flex items-center gap-2 text-[14px] text-[#1F6F2E]">
                <CheckCircle className="h-4 w-4" />
                Cảm ơn! Rất vui vì kết quả chẩn đoán hữu ích cho bạn.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Sources & Confidence Note */}
        <div className="rounded-xl border border-[#E0E0E0] bg-[#F7F7F7] p-4">
          <p className="mb-1.5 text-[12px] leading-[1.5] text-[#757575]">
            <span className="font-[600]">Nguồn tham khảo:</span>{" "}
            {mockResult.sources}
          </p>
          <p className="text-[12px] leading-[1.5] text-[#757575]">
            <span className="font-[600]">Lưu ý:</span>{" "}
            {mockResult.confidenceNote}
          </p>
        </div>
      </div>
    </div>
  );
}
