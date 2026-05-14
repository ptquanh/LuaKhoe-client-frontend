"use client";

import { Filter, Flag, Search, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface Feedback {
  id: number;
  farmer: string;
  disease: string;
  rating: "positive" | "negative";
  comment: string;
  date: string;
  flagged: boolean;
}

const mockFeedback: Feedback[] = [
  {
    id: 1,
    farmer: "Nguyễn Văn A",
    disease: "Bệnh đạo ôn",
    rating: "positive",
    comment: "Chẩn đoán chính xác, phác đồ chi tiết.",
    date: "22/04/2026",
    flagged: false,
  },
  {
    id: 2,
    farmer: "Trần Thị B",
    disease: "Bệnh bạc lá",
    rating: "negative",
    comment: "Nhầm bệnh bạc lá thành đạo ôn.",
    date: "21/04/2026",
    flagged: true,
  },
  {
    id: 3,
    farmer: "Lê Văn C",
    disease: "Bệnh khô vằn",
    rating: "positive",
    comment: "Phát hiện sớm, cứu được ruộng.",
    date: "20/04/2026",
    flagged: false,
  },
  {
    id: 4,
    farmer: "Phạm Thị D",
    disease: "Bệnh đốm nâu",
    rating: "negative",
    comment: "Phác đồ không phù hợp vùng ĐBSCL.",
    date: "19/04/2026",
    flagged: true,
  },
  {
    id: 5,
    farmer: "Hoàng Văn E",
    disease: "Bệnh đạo ôn",
    rating: "positive",
    comment: "Nhanh, chính xác. Rất hài lòng.",
    date: "18/04/2026",
    flagged: false,
  },
  {
    id: 6,
    farmer: "Vũ Thị F",
    disease: "Bệnh vàng lùn",
    rating: "negative",
    comment: "Độ tin cậy thấp, cần cải thiện.",
    date: "17/04/2026",
    flagged: false,
  },
];

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(mockFeedback);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<
    "all" | "positive" | "negative"
  >("all");

  const filtered = feedbacks.filter((f) => {
    const matchSearch =
      f.farmer.toLowerCase().includes(search.toLowerCase()) ||
      f.disease.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === "all" || f.rating === filterRating;
    return matchSearch && matchRating;
  });

  const toggleFlag = (id: number) =>
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, flagged: !f.flagged } : f)),
    );
  const positiveCount = feedbacks.filter((f) => f.rating === "positive").length;
  const negativeCount = feedbacks.filter((f) => f.rating === "negative").length;

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6">
        <h1 className="text-[28px] font-[700] text-[#1B1B1B]">Phản hồi AI</h1>
        <p className="mt-1 text-[14px] text-[#5C5C5C]">
          Quản lý phản hồi từ nông dân về kết quả chẩn đoán
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 text-center">
          <p className="text-[24px] font-[700] text-[#1B1B1B]">
            {feedbacks.length}
          </p>
          <p className="text-[13px] text-[#5C5C5C]">Tổng phản hồi</p>
        </div>
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 text-center">
          <p className="text-[24px] font-[700] text-[#2E7D32]">
            {positiveCount}
          </p>
          <p className="text-[13px] text-[#5C5C5C]">Tích cực</p>
        </div>
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 text-center">
          <p className="text-[24px] font-[700] text-[#E53935]">
            {negativeCount}
          </p>
          <p className="text-[13px] text-[#5C5C5C]">Tiêu cực</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-[300px] flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="h-10 w-full rounded-lg border border-[#E0E0E0] pr-4 pl-10 text-[14px] focus:border-[#2F9E44] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="mr-1 h-4 w-4 text-[#5C5C5C]" />
          {(["all", "positive", "negative"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`h-8 cursor-pointer rounded-lg px-3 text-[13px] font-[500] transition-colors ${filterRating === r ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
            >
              {r === "all"
                ? "Tất cả"
                : r === "positive"
                  ? "Tích cực"
                  : "Tiêu cực"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((f) => (
          <div
            key={f.id}
            className={`rounded-xl border bg-white p-4 transition-colors ${f.flagged ? "border-[#FB8C00] bg-[#FFF8E1]" : "border-[#E0E0E0]"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  {f.rating === "positive" ? (
                    <ThumbsUp className="h-4 w-4 text-[#2E7D32]" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-[#E53935]" />
                  )}
                  <span className="text-[14px] font-[500] text-[#1B1B1B]">
                    {f.farmer}
                  </span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[12px] text-[#5C5C5C]">
                    {f.disease}
                  </span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[12px] text-[#9E9E9E]">{f.date}</span>
                </div>
                <p className="text-[14px] leading-[1.5] text-[#5C5C5C]">
                  {f.comment}
                </p>
              </div>
              <button
                onClick={() => toggleFlag(f.id)}
                className={`flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-md px-2.5 text-[12px] font-[500] transition-colors ${f.flagged ? "bg-[#FB8C00] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#FFF3E0]"}`}
              >
                <Flag className="h-3.5 w-3.5" />
                {f.flagged ? "Flagged" : "Flag"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
