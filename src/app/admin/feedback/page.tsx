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
import DiagnosisHistoryModal, {
  DiagnosisData,
} from "./_components/DiagnosisHistoryModal";

interface FeedbackDisplay {
  id: string;
  farmer: string;
  farmerName?: string;
  disease: string;
  /** Numeric star rating from the user (1–5) */
  starRating?: number;
  /** positive = rating >= 4, negative = rating <= 2, neutral = 3 */
  sentiment: "positive" | "negative" | "neutral";
  comment: string;
  date: string;
  flagged: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  actualDiseases?: string;
  adminResponse?: string;
  diagnosis?: DiagnosisData;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<
    "all" | "positive" | "negative" | "neutral"
  >("all");

  // History Modal States
  const [selectedDiagnosis, setSelectedDiagnosis] =
    useState<DiagnosisData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reply Modal States
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [processStatus, setProcessStatus] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await feedbackService.getAll();
      if (res.success && res.data) {
        const mapped: FeedbackDisplay[] = res.data.map((item) => {
          const comment = item.content || "";
          const starRating = item.rating;
          const sentiment: "positive" | "negative" | "neutral" = !starRating
            ? "neutral"
            : starRating >= 4
              ? "positive"
              : starRating <= 2
                ? "negative"
                : "neutral";

          const userProfile = item.user?.farmerProfile;
          const constructedFarmerName = userProfile
            ? [userProfile.firstName, userProfile.lastName]
                .filter(Boolean)
                .join(" ") || item.user?.username
            : item.user?.username;
          const finalFarmerName = constructedFarmerName || "Nông dân ẩn danh";

          return {
            id: item.id,
            farmer: finalFarmerName,
            farmerName: finalFarmerName,
            disease:
              item.diagnosis?.results?.[0]?.disease?.name ||
              item.diagnosis?.disease_name ||
              "Chẩn đoán bệnh lúa",
            starRating,
            sentiment,
            comment,
            date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
            flagged: (item.status || "").toUpperCase() === "PENDING",
            status: (item.status || "PENDING").toUpperCase() as any,
            actualDiseases:
              item.actualDiseases?.map((ad) => ad.disease?.name).join(", ") ||
              "Không báo thêm bệnh",
            adminResponse: item.adminResponse || undefined,
            diagnosis: item.diagnosis
              ? {
                  id: item.diagnosis.id,
                  imageUrl: item.diagnosis.originalImageUrl,
                  originalImageUrl: item.diagnosis.originalImageUrl,
                  resultImageUrl: item.diagnosis.resultImageUrl || undefined,
                  createdAt: item.diagnosis.createdAt,
                  results: (item.diagnosis.results || []).map((r) => ({
                    confidence: r.confidence,
                    disease: {
                      id: r.disease?.id || "",
                      name: r.disease?.name || "",
                      description: r.disease?.signs || "",
                      treatment: r.disease?.treatment || "",
                    },
                    advisory: r.advisory || null,
                  })),
                  province: item.diagnosis.province,
                  envDescription: item.diagnosis.envDescription,
                }
              : undefined,
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
        status: processStatus,
        response: replyText,
      });
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === selectedFeedbackId
            ? {
                ...f,
                status: processStatus,
                adminResponse: replyText,
                flagged: false,
              }
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
            ? {
                ...f,
                status: processStatus,
                adminResponse: replyText,
                flagged: false,
              }
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
    const matchRating = filterRating === "all" || f.sentiment === filterRating;
    return matchSearch && matchRating;
  });

  const positiveCount = feedbacks.filter(
    (f) => f.sentiment === "positive",
  ).length;
  const negativeCount = feedbacks.filter(
    (f) => f.sentiment === "negative",
  ).length;
  const neutralCount = feedbacks.filter(
    (f) => f.sentiment === "neutral",
  ).length;

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
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div
          onClick={() => setFilterRating("all")}
          className={`cursor-pointer rounded-xl border bg-white p-4 text-center shadow-sm transition-all hover:shadow-md ${filterRating === "all" ? "border-[#2F9E44] ring-2 ring-[#2F9E44]/20" : "border-[#E0E0E0]"}`}
        >
          <p className="text-[24px] font-[700] text-[#1B1B1B]">
            {feedbacks.length}
          </p>
          <p className="text-[13px] text-[#5C5C5C]">Tổng phản hồi</p>
        </div>
        <div
          onClick={() => setFilterRating("positive")}
          className={`cursor-pointer rounded-xl border bg-white p-4 text-center shadow-sm transition-all hover:shadow-md ${filterRating === "positive" ? "border-[#2E7D32] ring-2 ring-[#2E7D32]/20" : "border-[#E0E0E0]"}`}
        >
          <p className="text-[24px] font-[700] text-[#2E7D32]">
            {positiveCount}
          </p>
          <p className="text-[13px] text-[#5C5C5C]">Tích cực</p>
        </div>
        <div
          onClick={() => setFilterRating("neutral")}
          className={`cursor-pointer rounded-xl border bg-white p-4 text-center shadow-sm transition-all hover:shadow-md ${filterRating === "neutral" ? "border-[#FB8C00] ring-2 ring-[#FB8C00]/20" : "border-[#E0E0E0]"}`}
        >
          <p className="text-[24px] font-[700] text-[#FB8C00]">
            {neutralCount}
          </p>
          <p className="text-[13px] text-[#5C5C5C]">Trung tính</p>
        </div>
        <div
          onClick={() => setFilterRating("negative")}
          className={`cursor-pointer rounded-xl border bg-white p-4 text-center shadow-sm transition-all hover:shadow-md ${filterRating === "negative" ? "border-[#E53935] ring-2 ring-[#E53935]/20" : "border-[#E0E0E0]"}`}
        >
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
          {(["all", "positive", "neutral", "negative"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`h-8 cursor-pointer rounded-lg px-3 text-[13px] font-[500] transition-colors ${filterRating === r ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
            >
              {r === "all"
                ? "Tất cả"
                : r === "positive"
                  ? "Tích cực"
                  : r === "neutral"
                    ? "Trung tính"
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
              if (
                (e.target as HTMLElement).closest("button") ||
                (e.target as HTMLElement).closest("a")
              ) {
                return;
              }
              setSelectedFeedbackId(f.id);
              const targetStatus =
                f.status === "PENDING" ? "APPROVED" : f.status;
              if (targetStatus === "APPROVED" || targetStatus === "REJECTED") {
                setProcessStatus(targetStatus);
              }
              setReplyText(f.adminResponse || "");
              setReplyModalOpen(true);
            }}
            className={`cursor-pointer rounded-xl border bg-white p-4 transition-all duration-200 hover:border-[#2F9E44] hover:shadow-md ${f.flagged ? "border-[#FB8C00] bg-[#FFF8E1]" : "border-[#E0E0E0]"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {f.sentiment === "positive" ? (
                    <ThumbsUp className="h-4 w-4 text-[#2E7D32]" />
                  ) : f.sentiment === "negative" ? (
                    <ThumbsDown className="h-4 w-4 text-[#E53935]" />
                  ) : null}
                  <span className="text-[14px] font-[700] text-[#1B1B1B]">
                    {f.farmer}
                  </span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[13px] font-[500] text-[#5C5C5C]">
                    Chẩn đoán AI:{" "}
                    <strong className="text-[#2E7D32]">{f.disease}</strong>
                  </span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[12px] text-[#9E9E9E]">{f.date}</span>
                  <span
                    className={`ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-[600] ${
                      f.status === "APPROVED"
                        ? "bg-[#E6F4EA] text-[#1F6F2E]"
                        : f.status === "REJECTED"
                          ? "bg-[#FFEBEE] text-[#C62828]"
                          : "bg-[#FFF8E1] text-[#F57F17]"
                    }`}
                  >
                    {f.status === "APPROVED"
                      ? "Đã duyệt"
                      : f.status === "REJECTED"
                        ? "Đã từ chối"
                        : "Chờ xử lý"}
                  </span>
                </div>

                {/* Star rating + comment rendered separately */}
                <div className="mb-2 flex flex-col gap-1">
                  {f.starRating && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={`text-[14px] ${
                            s <= f.starRating!
                              ? "text-[#FB8C00]"
                              : "text-[#E0E0E0]"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-1 text-[12px] font-[600] text-[#FB8C00]">
                        {f.starRating}/5
                      </span>
                    </div>
                  )}
                  {f.comment ? (
                    <p className="text-[14px] leading-[1.6] font-medium text-[#333333]">
                      &quot;{f.comment}&quot;
                    </p>
                  ) : f.starRating ? (
                    <p className="text-[13px] text-[#9E9E9E] italic">
                      Chỉ chấm sao, không có nhận xét.
                    </p>
                  ) : (
                    <p className="text-[13px] text-[#9E9E9E] italic">
                      Chưa có đánh giá chi tiết.
                    </p>
                  )}
                </div>

                {/* Farmer reported actual diseases */}
                <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[12px]">
                  <span className="font-[600] text-[#757575]">
                    Thực tế ruộng:
                  </span>
                  <span className="rounded bg-[#FFE0B2] px-2.5 py-0.5 font-[600] text-[#E65100]">
                    {f.actualDiseases}
                  </span>
                </div>

                {/* Admin response reply */}
                {f.adminResponse && (
                  <div className="mt-3 rounded-lg border border-dashed border-[#E0E0E0] bg-[#FAFAFA] p-3 text-[13px] transition-colors hover:border-[#2F9E44] hover:bg-[#F0F2F5]">
                    <p className="mb-1 font-[700] text-[#5C5C5C]">
                      Cán bộ chuyên môn phản hồi (Nhấn để chỉnh sửa):
                    </p>
                    <p className="text-[#333333] italic">"{f.adminResponse}"</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {f.diagnosis && (
                  <button
                    onClick={() => {
                      setSelectedDiagnosis(f.diagnosis || null);
                      setIsModalOpen(true);
                    }}
                    className="flex h-8 cursor-pointer items-center gap-1 rounded-md border border-[#1976D2] px-3 text-[12px] font-[600] text-[#1976D2] transition-colors hover:bg-[#E3F2FD]"
                  >
                    Xem Lịch sử
                  </button>
                )}
                {f.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => {
                        setSelectedFeedbackId(f.id);
                        setProcessStatus("APPROVED");
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
                      if (f.status === "APPROVED" || f.status === "REJECTED") {
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
          <div className="animate-in fade-in zoom-in-95 w-full max-w-[500px] rounded-2xl border border-[#E0E0E0] bg-white p-6 shadow-2xl duration-200">
            <h3 className="mb-2 text-[18px] font-[700] text-[#1B1B1B]">
              Phản hồi & Xử lý ý kiến nông dân
            </h3>
            <p className="mb-4 text-[13px] text-[#5C5C5C]">
              Cập nhật nội dung tư vấn kỹ thuật hoặc thay đổi trạng thái duyệt
              cho phản hồi này.
            </p>

            <div className="mb-4 flex items-center gap-3">
              <span className="text-[13px] font-[600] text-[#5C5C5C]">
                Trạng thái xử lý:
              </span>
              <button
                type="button"
                onClick={() => setProcessStatus("APPROVED")}
                className={`h-8 cursor-pointer rounded-lg px-3 text-[12px] font-[600] transition-all duration-150 ${processStatus === "APPROVED" ? "border border-[#1F6F2E] bg-[#E6F4EA] text-[#1F6F2E] shadow-sm" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
              >
                Duyệt
              </button>
              <button
                type="button"
                onClick={() => setProcessStatus("REJECTED")}
                className={`h-8 cursor-pointer rounded-lg px-3 text-[12px] font-[600] transition-all duration-150 ${processStatus === "REJECTED" ? "border border-[#C62828] bg-[#FFEBEE] text-[#C62828] shadow-sm" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
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
                className={`h-10 cursor-pointer rounded-lg px-4 text-[14px] font-[600] text-white ${processStatus === "APPROVED" ? "bg-[#2F9E44] hover:bg-[#1F6F2E]" : "bg-[#E53935] hover:bg-[#C62828]"}`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis History Modal */}
      <DiagnosisHistoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDiagnosis(null);
        }}
        diagnosisData={selectedDiagnosis}
      />
    </div>
  );
}
