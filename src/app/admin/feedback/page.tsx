"use client";

import {
  CheckCircle,
  Filter,
  Flag,
  Loader2,
  Search,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { feedbackService } from "@/services/feedback.service";

interface FeedbackDisplay {
  id: string;
  farmer: string;
  disease: string;
  rating: "positive" | "negative";
  comment: string;
  date: string;
  flagged: boolean;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<
    "all" | "positive" | "negative"
  >("all");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await feedbackService.getAll();
        if (res.success && res.data && res.data.length > 0) {
          const mapped: FeedbackDisplay[] = res.data.map((item) => {
            const comment = item.userMessage || "";
            const isPos =
              comment.includes("4/5") ||
              comment.includes("5/5") ||
              comment.includes("tích cực");
            return {
              id: item.id,
              farmer: item.user?.fullName || "Nông dân Ẩn danh",
              disease:
                item.diagnosis?.results?.[0]?.disease?.name ||
                item.diagnosis?.disease_name ||
                "Chẩn đoán bệnh lúa",
              rating: isPos ? "positive" : "negative",
              comment: comment,
              date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
              flagged: item.status === "PENDING",
              status: item.status as any,
            };
          });
          setFeedbacks(mapped);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách phản hồi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleProcess = async (
    id: string,
    newStatus: "ACCEPTED" | "REJECTED",
  ) => {
    try {
      await feedbackService.process(id, { status: newStatus });
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: newStatus, flagged: false } : f,
        ),
      );
    } catch (err) {
      console.error("Lỗi xử lý phản hồi:", err);
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: newStatus, flagged: false } : f,
        ),
      );
    }
  };

  const toggleFlag = (id: string) =>
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, flagged: !f.flagged } : f)),
    );

  const filtered = feedbacks.filter((f) => {
    const matchSearch =
      f.farmer.toLowerCase().includes(search.toLowerCase()) ||
      f.disease.toLowerCase().includes(search.toLowerCase()) ||
      f.comment.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === "all" || f.rating === filterRating;
    return matchSearch && matchRating;
  });

  const positiveCount = feedbacks.filter((f) => f.rating === "positive").length;
  const negativeCount = feedbacks.filter((f) => f.rating === "negative").length;

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">Phản hồi AI</h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            Quản lý phản hồi từ nông dân về kết quả chẩn đoán
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-[#5C5C5C]">
            <Loader2 className="h-5 w-5 animate-spin text-[#2F9E44]" />
            <span className="text-[14px]">Đang tải...</span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 text-center shadow-sm">
          <p className="text-[24px] font-[700] text-[#1B1B1B]">
            {feedbacks.length}
          </p>
          <p className="text-[13px] text-[#5C5C5C]">Tổng phản hồi</p>
        </div>
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 text-center shadow-sm">
          <p className="text-[24px] font-[700] text-[#2E7D32]">
            {positiveCount}
          </p>
          <p className="text-[13px] text-[#5C5C5C]">Tích cực</p>
        </div>
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 text-center shadow-sm">
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
            placeholder="Tìm kiếm nông dân, bệnh, nội dung..."
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
                  <span className="text-[14px] font-[700] text-[#1B1B1B]">
                    {f.farmer}
                  </span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[13px] font-[500] text-[#2E7D32]">
                    {f.disease}
                  </span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[12px] text-[#9E9E9E]">{f.date}</span>
                  <span
                    className={`ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-[600] ${
                      f.status === "ACCEPTED"
                        ? "bg-[#E6F4EA] text-[#1F6F2E]"
                        : f.status === "REJECTED"
                          ? "bg-[#FFEBEE] text-[#C62828]"
                          : "bg-[#FFF8E1] text-[#F57F17]"
                    }`}
                  >
                    {f.status === "ACCEPTED"
                      ? "Đã duyệt"
                      : f.status === "REJECTED"
                        ? "Đã từ chối"
                        : "Chờ xử lý"}
                  </span>
                </div>
                <p className="text-[14px] leading-[1.6] text-[#333333]">
                  {f.comment}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {f.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleProcess(f.id, "ACCEPTED")}
                      className="flex h-8 cursor-pointer items-center gap-1 rounded-md bg-[#2F9E44] px-3 text-[12px] font-[600] text-white transition-colors hover:bg-[#1F6F2E]"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Duyệt
                    </button>
                    <button
                      onClick={() => handleProcess(f.id, "REJECTED")}
                      className="flex h-8 cursor-pointer items-center gap-1 rounded-md border border-[#E53935] px-3 text-[12px] font-[600] text-[#E53935] transition-colors hover:bg-[#FFEBEE]"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Từ chối
                    </button>
                  </>
                )}
                <button
                  onClick={() => toggleFlag(f.id)}
                  className={`flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-md px-2.5 text-[12px] font-[500] transition-colors ${f.flagged ? "bg-[#FB8C00] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#FFF3E0]"}`}
                >
                  <Flag className="h-3.5 w-3.5" />
                  {f.flagged ? "Đang theo dõi" : "Theo dõi"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[#E0E0E0] bg-white py-12 text-center text-[#5C5C5C]">
            Không tìm thấy phản hồi nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}
