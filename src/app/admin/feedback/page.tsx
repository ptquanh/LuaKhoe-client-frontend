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
  actualDiseases?: string;
  adminResponse?: string;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<
    "all" | "positive" | "negative"
  >("all");

  // Reply Modal States
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [processStatus, setProcessStatus] = useState<"ACCEPTED" | "REJECTED" | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await feedbackService.getAll();
      if (res.success && res.data) {
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
            flagged: (item.status || "").toUpperCase() === "PENDING",
            status: (item.status || "PENDING").toUpperCase() as any,
            actualDiseases: item.actualDiseases?.map(ad => ad.disease?.name).join(', ') || 'Không báo thêm bệnh',
            adminResponse: item.adminResponse || undefined,
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

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const submitReply = async () => {
    if (!selectedFeedbackId || !processStatus) return;
    try {
      await feedbackService.process(selectedFeedbackId, {
        status: processStatus.toLowerCase() as any,
        response: replyText,
      });
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === selectedFeedbackId
            ? { ...f, status: processStatus, adminResponse: replyText, flagged: false }
            : f,
        ),
      );
      setReplyModalOpen(false);
      setSelectedFeedbackId(null);
      setReplyText("");
      setProcessStatus(null);
    } catch (err) {
      console.error("Lỗi xử lý phản hồi:", err);
      // Fallback local update
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === selectedFeedbackId
            ? { ...f, status: processStatus, adminResponse: replyText, flagged: false }
            : f,
        ),
      );
      setReplyModalOpen(false);
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
            onClick={(e) => {
              // Ignore clicks on buttons
              if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) {
                return;
              }
              setSelectedFeedbackId(f.id);
              const targetStatus = f.status === "PENDING" ? "ACCEPTED" : f.status;
              if (targetStatus === "ACCEPTED" || targetStatus === "REJECTED") {
                setProcessStatus(targetStatus);
              }
              setReplyText(f.adminResponse || "");
              setReplyModalOpen(true);
            }}
            className={`rounded-xl border bg-white p-4 transition-all duration-200 cursor-pointer hover:border-[#2F9E44] hover:shadow-md ${f.flagged ? "border-[#FB8C00] bg-[#FFF8E1]" : "border-[#E0E0E0]"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {f.rating === "positive" ? (
                    <ThumbsUp className="h-4 w-4 text-[#2E7D32]" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-[#E53935]" />
                  )}
                  <span className="text-[14px] font-[700] text-[#1B1B1B]">
                    {f.farmer}
                  </span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[13px] font-[500] text-[#5C5C5C]">
                    Chẩn đoán AI: <strong className="text-[#2E7D32]">{f.disease}</strong>
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
                
                <p className="text-[14px] leading-[1.6] text-[#333333] mb-2 font-medium">
                  "{f.comment}"
                </p>

                {/* Farmer reported actual diseases */}
                <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[12px]">
                  <span className="font-[600] text-[#757575]">Thực tế ruộng:</span>
                  <span className="rounded bg-[#FFE0B2] px-2.5 py-0.5 font-[600] text-[#E65100]">
                    {f.actualDiseases}
                  </span>
                </div>

                {/* Admin response reply */}
                {f.adminResponse && (
                  <div className="mt-3 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3 text-[13px] hover:bg-[#F0F2F5] transition-colors border-dashed hover:border-[#2F9E44]">
                    <p className="font-[700] text-[#5C5C5C] mb-1">Cán bộ chuyên môn phản hồi (Nhấn để chỉnh sửa):</p>
                    <p className="text-[#333333] italic">"{f.adminResponse}"</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {f.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => {
                        setSelectedFeedbackId(f.id);
                        setProcessStatus("ACCEPTED");
                        setReplyText(f.adminResponse || "");
                        setReplyModalOpen(true);
                      }}
                      className="flex h-8 cursor-pointer items-center gap-1 rounded-md bg-[#2F9E44] px-3 text-[12px] font-[600] text-white transition-colors hover:bg-[#1F6F2E]"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Duyệt & Phản hồi
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFeedbackId(f.id);
                        setProcessStatus("REJECTED");
                        setReplyText(f.adminResponse || "");
                        setReplyModalOpen(true);
                      }}
                      className="flex h-8 cursor-pointer items-center gap-1 rounded-md border border-[#E53935] px-3 text-[12px] font-[600] text-[#E53935] transition-colors hover:bg-[#FFEBEE]"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Từ chối
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedFeedbackId(f.id);
                      if (f.status === "ACCEPTED" || f.status === "REJECTED") {
                        setProcessStatus(f.status);
                      }
                      setReplyText(f.adminResponse || "");
                      setReplyModalOpen(true);
                    }}
                    className="flex h-8 cursor-pointer items-center gap-1 rounded-md border border-[#2F9E44] px-3 text-[12px] font-[600] text-[#2F9E44] transition-colors hover:bg-[#E6F4EA]"
                  >
                    Sửa phản hồi
                  </button>
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

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[500px] rounded-2xl border border-[#E0E0E0] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="mb-2 text-[18px] font-[700] text-[#1B1B1B]">
              Phản hồi & Xử lý ý kiến nông dân
            </h3>
            <p className="mb-4 text-[13px] text-[#5C5C5C]">
              Cập nhật nội dung tư vấn kỹ thuật hoặc thay đổi trạng thái duyệt cho phản hồi này.
            </p>
            
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[13px] font-[600] text-[#5C5C5C]">Trạng thái xử lý:</span>
              <button
                type="button"
                onClick={() => setProcessStatus("ACCEPTED")}
                className={`h-8 cursor-pointer rounded-lg px-3 text-[12px] font-[600] transition-all duration-150 ${processStatus === "ACCEPTED" ? "bg-[#E6F4EA] text-[#1F6F2E] border border-[#1F6F2E] shadow-sm" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
              >
                Duyệt
              </button>
              <button
                type="button"
                onClick={() => setProcessStatus("REJECTED")}
                className={`h-8 cursor-pointer rounded-lg px-3 text-[12px] font-[600] transition-all duration-150 ${processStatus === "REJECTED" ? "bg-[#FFEBEE] text-[#C62828] border border-[#C62828] shadow-sm" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
              >
                Từ chối
              </button>
            </div>

            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ví dụ: Cần hạn chế bón phân đạm, tháo cạn nước ruộng và phun hoạt chất..."
              className="mb-6 w-full resize-none rounded-xl border border-[#E0E0E0] p-4 text-[13px] focus:border-[#2F9E44] focus:ring-2 focus:ring-[#2F9E44]/10 focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setReplyModalOpen(false);
                  setSelectedFeedbackId(null);
                  setReplyText("");
                  setProcessStatus(null);
                }}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5]"
              >
                Hủy
              </button>
              <button
                onClick={submitReply}
                className={`h-10 cursor-pointer rounded-lg px-4 text-[14px] font-[600] text-white ${processStatus === "ACCEPTED" ? "bg-[#2F9E44] hover:bg-[#1F6F2E]" : "bg-[#E53935] hover:bg-[#C62828]"}`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
