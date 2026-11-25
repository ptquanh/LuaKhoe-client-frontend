"use client";

import {
  CheckCircle,
  Filter,
  Flag,
  Loader2,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        title="Phản hồi AI"
        description="Quản lý phản hồi từ nông dân về kết quả chẩn đoán"
        actions={
          loading ? (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />
              <span>Đang tải...</span>
            </div>
          ) : undefined
        }
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div
          onClick={() => setFilterRating("all")}
          className={`cursor-pointer rounded-2xl border bg-[var(--bg-card)] p-4 text-center shadow-xs transition-all hover:shadow-md ${filterRating === "all" ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20" : "border-[var(--border)]"}`}
        >
          <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            {feedbacks.length}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Tổng phản hồi
          </p>
        </div>
        <div
          onClick={() => setFilterRating("positive")}
          className={`cursor-pointer rounded-2xl border bg-[var(--bg-card)] p-4 text-center shadow-xs transition-all hover:shadow-md ${filterRating === "positive" ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-[var(--border)]"}`}
        >
          <p className="text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
            {positiveCount}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)]">Tích cực</p>
        </div>
        <div
          onClick={() => setFilterRating("neutral")}
          className={`cursor-pointer rounded-2xl border bg-[var(--bg-card)] p-4 text-center shadow-xs transition-all hover:shadow-md ${filterRating === "neutral" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-[var(--border)]"}`}
        >
          <p className="text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400">
            {neutralCount}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)]">Trung tính</p>
        </div>
        <div
          onClick={() => setFilterRating("negative")}
          className={`cursor-pointer rounded-2xl border bg-[var(--bg-card)] p-4 text-center shadow-xs transition-all hover:shadow-md ${filterRating === "negative" ? "border-red-500 ring-2 ring-red-500/20" : "border-[var(--border)]"}`}
        >
          <p className="text-2xl font-bold text-red-600 tabular-nums dark:text-red-400">
            {negativeCount}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)]">Tiêu cực</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nông dân, bệnh, nội dung..."
            className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pr-4 pl-10 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="mr-1 h-4 w-4 text-[var(--text-muted)]" />
          {(["all", "positive", "neutral", "negative"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`min-h-10 cursor-pointer rounded-xl px-3.5 text-[13px] font-medium transition-colors ${filterRating === r ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
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
            className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:border-[var(--primary)] hover:shadow-md ${
              f.flagged
                ? "border-amber-300 bg-amber-50/40 dark:border-amber-700/70 dark:bg-amber-950/20"
                : "border-[var(--border)] bg-[var(--bg-card)]"
            }`}
          >
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {f.sentiment === "positive" ? (
                    <ThumbsUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : f.sentiment === "negative" ? (
                    <ThumbsDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {f.farmer}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">·</span>
                  <span className="text-[13px] font-medium text-[var(--text-secondary)]">
                    Chẩn đoán AI:{" "}
                    <strong className="text-[var(--primary)]">
                      {f.disease}
                    </strong>
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">·</span>
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">
                    {f.date}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      f.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : f.status === "REJECTED"
                          ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                          : "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
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
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= f.starRating!
                              ? "fill-amber-400 text-amber-400"
                              : "text-[var(--border-strong)]"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs font-semibold text-amber-600 tabular-nums dark:text-amber-400">
                        {f.starRating}/5
                      </span>
                    </div>
                  )}
                  {f.comment ? (
                    <p className="text-sm leading-relaxed font-medium text-[var(--text-primary)]">
                      &quot;{f.comment}&quot;
                    </p>
                  ) : f.starRating ? (
                    <p className="text-[13px] text-[var(--text-muted)] italic">
                      Chỉ chấm sao, không có nhận xét.
                    </p>
                  ) : (
                    <p className="text-[13px] text-[var(--text-muted)] italic">
                      Chưa có đánh giá chi tiết.
                    </p>
                  )}
                </div>

                {/* Farmer reported actual diseases */}
                <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-semibold text-[var(--text-muted)]">
                    Thực tế ruộng:
                  </span>
                  <span className="rounded-md bg-amber-100/80 px-2.5 py-0.5 font-semibold text-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                    {f.actualDiseases}
                  </span>
                </div>

                {/* Admin response reply */}
                {f.adminResponse && (
                  <div className="mt-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-3 text-[13px] transition-colors hover:border-[var(--primary)]">
                    <p className="mb-1 font-bold text-[var(--text-secondary)]">
                      Cán bộ chuyên môn phản hồi (Nhấn để chỉnh sửa):
                    </p>
                    <p className="text-[var(--text-primary)] italic">
                      &quot;{f.adminResponse}&quot;
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {f.diagnosis && (
                  <button
                    onClick={() => {
                      setSelectedDiagnosis(f.diagnosis || null);
                      setIsModalOpen(true);
                    }}
                    className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg border border-sky-500/40 px-3 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/30"
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
                      className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg bg-[var(--primary)] px-3 text-xs font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
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
                      className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg border border-red-300 px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
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
                    className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg border border-[var(--primary)]/40 px-3 text-xs font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)]"
                  >
                    Sửa phản hồi
                  </button>
                )}
                <button
                  onClick={() => toggleFlag(f.id)}
                  className={`flex min-h-9 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2.5 text-xs font-medium transition-colors ${f.flagged ? "bg-amber-500 text-white" : "border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
                >
                  <Flag className="h-3.5 w-3.5" />
                  {f.flagged ? "Đang theo dõi" : "Theo dõi"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="Không tìm thấy phản hồi nào phù hợp"
            description="Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm."
          />
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[500px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
              Phản hồi & Xử lý ý kiến nông dân
            </h3>
            <p className="mb-4 text-[13px] text-[var(--text-secondary)]">
              Cập nhật nội dung tư vấn kỹ thuật hoặc thay đổi trạng thái duyệt
              cho phản hồi này.
            </p>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
                Trạng thái xử lý:
              </span>
              <button
                type="button"
                onClick={() => setProcessStatus("APPROVED")}
                className={`min-h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors ${processStatus === "APPROVED" ? "border border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] shadow-xs" : "border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
              >
                Duyệt
              </button>
              <button
                type="button"
                onClick={() => setProcessStatus("REJECTED")}
                className={`min-h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors ${processStatus === "REJECTED" ? "border border-red-400 bg-red-50 text-red-700 shadow-xs dark:border-red-700 dark:bg-red-950/50 dark:text-red-300" : "border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
              >
                Từ chối
              </button>
            </div>

            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ví dụ: Cần hạn chế bón phân đạm, tháo cạn nước ruộng và phun hoạt chất..."
              className="mb-6 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 focus:outline-none sm:text-sm"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setReplyModalOpen(false);
                  setSelectedFeedbackId(null);
                  setReplyText("");
                  setProcessStatus(null);
                }}
                className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                Hủy
              </button>
              <button
                onClick={submitReply}
                className={`min-h-11 cursor-pointer rounded-xl px-4 text-sm font-semibold text-white ${processStatus === "APPROVED" ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)]" : "bg-red-600 hover:bg-red-700"}`}
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
