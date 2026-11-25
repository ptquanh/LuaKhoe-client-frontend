"use client";

import { message, Modal } from "antd";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { useNutritionChunks } from "@/hooks/useNutritionChunks";

export default function AdminDocumentsPage() {
  const [keyword, setKeyword] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [source, setSource] = useState("");
  const [searchSource, setSearchSource] = useState("");
  const [format, setFormat] = useState("");
  const [searchFormat, setSearchFormat] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<"file" | "manual">("file");
  const [dragOver, setDragOver] = useState(false);

  // Manual form state
  const [manualSource, setManualSource] = useState("");
  const [manualContent, setManualContent] = useState("");

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    chunksData,
    isLoading,
    createChunk,
    isCreating,
    deleteChunk,
    uploadFile,
    isUploading,
  } = useNutritionChunks({
    limit,
    offset,
    keyword: searchVal || undefined,
    source: searchSource || undefined,
    format: searchFormat || undefined,
  });

  const isSavingOrUploading = isCreating || isUploading;

  const totalChunks = chunksData?.total || 0;
  const chunks = chunksData?.rows || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed.length > 0 && trimmed.length < 3) {
      message.warning("Từ khóa tìm kiếm phải có tối thiểu 3 ký tự.");
      return;
    }
    setOffset(0);
    setSearchVal(trimmed);
    setSearchSource(source.trim());
    setSearchFormat(format);
  };

  const handleClearSearch = () => {
    setKeyword("");
    setSearchVal("");
    setSource("");
    setSearchSource("");
    setFormat("");
    setSearchFormat("");
    setOffset(0);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa đoạn tri thức",
      content: "Bạn có chắc chắn muốn xóa đoạn tri thức dinh dưỡng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteChunk(id);
          message.success("Đã xóa đoạn tri thức thành công.");
        } catch (err) {
          console.error("Lỗi khi xóa chunk:", err);
          message.error("Không thể xóa đoạn tri thức.");
        }
      },
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Upload file directly using multipart/form-data
  const processFileContent = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "txt" && ext !== "md" && ext !== "pdf") {
      message.error("Chỉ hỗ trợ nạp tệp định dạng .txt, .md hoặc .pdf.");
      return;
    }

    try {
      await uploadFile(file);
      message.success("Đã nạp tệp tri thức thành công.");
      setShowUpload(false);
    } catch (err) {
      console.error("Lỗi nạp tệp:", err);
      message.error("Lỗi khi nạp nội dung tệp. Vui lòng thử lại.");
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFileContent(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFileContent(file);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualSource.trim() || !manualContent.trim()) {
      message.warning("Vui lòng điền đầy đủ nguồn và nội dung kiến thức.");
      return;
    }

    try {
      await createChunk({
        content: manualContent,
        source: manualSource,
        metadata: {
          fileType: "MANUAL",
        },
      });
      message.success("Đã thêm tri thức mới thành công.");
      setManualContent("");
      setManualSource("");
      setShowUpload(false);
    } catch (err) {
      console.error("Lỗi thêm tri thức:", err);
      message.error("Lỗi khi thêm tri thức. Vui lòng thử lại.");
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalChunks / limit) || 1;

  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset((prev) => prev - limit);
    }
  };

  const handleNextPage = () => {
    if (offset + limit < totalChunks) {
      setOffset((prev) => prev + limit);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="Cơ sở tri thức dinh dưỡng"
        description={`Tổng số: ${totalChunks} mảnh tri thức (chunks)`}
        actions={
          <button
            onClick={() => setShowUpload(true)}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            <Upload className="h-4 w-4" /> Nạp tri thức mới
          </button>
        }
      />

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="min-w-[200px] flex-1">
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-secondary)]">
              Tìm nội dung
            </label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pr-3 pl-10 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
              />
            </div>
          </div>

          <div className="min-w-[180px] flex-1">
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-secondary)]">
              Nguồn tài liệu
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Nhập tên nguồn..."
              className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
            />
          </div>

          <div className="w-full sm:w-[170px]">
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-secondary)]">
              Định dạng
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="min-h-11 w-full cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
            >
              <option value="">Tất cả định dạng</option>
              <option value=".pdf">PDF (.pdf)</option>
              <option value=".txt">Text (.txt)</option>
              <option value=".md">Markdown (.md)</option>
            </select>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <button
              type="submit"
              className="min-h-11 flex-1 cursor-pointer rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] sm:flex-none"
            >
              Tìm kiếm
            </button>
            {(keyword || source || format) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="space-y-2 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0"
            >
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : chunks.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="Không tìm thấy dữ liệu tri thức nào"
          description="Hãy nạp thêm tệp tài liệu hoặc văn bản để làm giàu tri thức RAG."
        />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {chunks.map((c: any) => {
              const fileType = c.chunkMetadata?.fileType || "TXT";
              const lastUpdated =
                c.createdAt || c.created_at
                  ? new Date(c.createdAt || c.created_at).toLocaleString(
                      "vi-VN",
                    )
                  : "—";
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                      <span className="text-sm font-semibold break-words text-[var(--text-primary)]">
                        {c.source || "Không rõ nguồn"}
                      </span>
                    </div>
                    <span className="shrink-0 rounded-md bg-[var(--bg-subtle)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                      {fileType}
                    </span>
                  </div>
                  <div
                    className={`mt-2 text-sm leading-relaxed whitespace-pre-line text-[var(--text-secondary)] ${
                      expandedIds.has(c.id) ? "" : "line-clamp-3"
                    }`}
                  >
                    {c.content}
                  </div>
                  {c.content.length > 150 && (
                    <button
                      onClick={() => toggleExpand(c.id)}
                      className="mt-1 cursor-pointer text-xs font-semibold text-[var(--primary)] hover:underline"
                    >
                      {expandedIds.has(c.id) ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                    <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                      {lastUpdated}
                    </span>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      aria-label="Xóa chunk"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  <th className="h-12 w-[180px] px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Nguồn tài liệu
                  </th>
                  <th className="h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Nội dung mảnh tri thức (Chunk)
                  </th>
                  <th className="h-12 w-[140px] px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                    Định dạng
                  </th>
                  <th className="hidden h-12 w-[180px] px-4 text-left text-[13px] font-semibold text-[var(--text-primary)] lg:table-cell">
                    Thời gian tạo
                  </th>
                  <th className="h-12 w-20 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                    Xóa
                  </th>
                </tr>
              </thead>
              <tbody>
                {chunks.map((c: any) => {
                  const fileType = c.chunkMetadata?.fileType || "TXT";
                  const lastUpdated =
                    c.createdAt || c.created_at
                      ? new Date(c.createdAt || c.created_at).toLocaleString(
                          "vi-VN",
                        )
                      : "—";

                  return (
                    <tr
                      key={c.id}
                      className="border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-hover)]"
                    >
                      <td className="px-4 py-3 align-top font-medium text-[var(--text-primary)]">
                        <div className="flex max-w-[170px] items-start gap-1.5">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                          <span className="text-[13px] leading-tight break-words">
                            {c.source || "Không rõ nguồn"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <div
                            className={`text-[13.5px] leading-relaxed whitespace-pre-line text-[var(--text-secondary)] ${
                              expandedIds.has(c.id) ? "" : "line-clamp-3"
                            }`}
                          >
                            {c.content}
                          </div>
                          {c.content.length > 150 && (
                            <button
                              onClick={() => toggleExpand(c.id)}
                              className="mt-1 cursor-pointer self-start text-xs font-semibold text-[var(--primary)] hover:underline"
                            >
                              {expandedIds.has(c.id) ? "Thu gọn" : "Xem thêm"}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center align-top">
                        <span className="rounded bg-[var(--bg-subtle)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                          {fileType}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 align-top text-xs text-[var(--text-muted)] tabular-nums lg:table-cell">
                        {lastUpdated}
                      </td>
                      <td className="px-4 py-3 text-center align-top">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="mx-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[var(--text-muted)] tabular-nums">
                Hiển thị {offset + 1}–{Math.min(offset + limit, totalChunks)} /{" "}
                {totalChunks}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPage}
                  disabled={offset === 0}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setOffset((p - 1) * limit)}
                      className={`h-10 min-w-10 cursor-pointer rounded-lg px-2 text-sm font-medium tabular-nums ${p === currentPage ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={handleNextPage}
                  disabled={offset + limit >= totalChunks}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[550px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Nạp tri thức dinh dưỡng RAG
              </h3>
              <button
                disabled={isSavingOrUploading}
                onClick={() => setShowUpload(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex border-b border-[var(--border)]">
              <button
                disabled={isSavingOrUploading}
                onClick={() => setActiveTab("file")}
                className={`mr-6 min-h-10 cursor-pointer border-b-2 pb-2 text-sm font-semibold transition-colors ${
                  activeTab === "file"
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Tải tệp văn bản
              </button>
              <button
                disabled={isSavingOrUploading}
                onClick={() => setActiveTab("manual")}
                className={`min-h-10 cursor-pointer border-b-2 pb-2 text-sm font-semibold transition-colors ${
                  activeTab === "manual"
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Nhập văn bản thủ công
              </button>
            </div>

            {activeTab === "file" ? (
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".txt,.md,.pdf"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  disabled={isSavingOrUploading}
                  className="hidden"
                />
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!isSavingOrUploading) setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() =>
                    !isSavingOrUploading && fileInputRef.current?.click()
                  }
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                    dragOver
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]/50"
                      : "border-[var(--border-strong)] hover:border-[var(--primary)] hover:bg-[var(--bg-subtle)]"
                  } ${isSavingOrUploading ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {isSavingOrUploading ? (
                    <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-[var(--primary)]" />
                  ) : (
                    <Upload className="mx-auto mb-3 h-10 w-10 text-[var(--text-muted)]" />
                  )}
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {isSavingOrUploading
                      ? "Đang tải lên & xử lý dữ liệu..."
                      : "Kéo thả hoặc click để chọn file"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Hỗ trợ định dạng tệp: .txt, .md, .pdf (tối đa 20MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[var(--text-primary)]">
                    Nguồn tài liệu
                  </label>
                  <input
                    type="text"
                    value={manualSource}
                    onChange={(e) => setManualSource(e.target.value)}
                    disabled={isSavingOrUploading}
                    placeholder="Ví dụ: Giáo trình trồng lúa Cần Thơ, Chương 2"
                    className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none disabled:bg-[var(--bg-subtle)] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[var(--text-primary)]">
                    Nội dung mảnh tri thức (Chunk)
                  </label>
                  <textarea
                    value={manualContent}
                    onChange={(e) => setManualContent(e.target.value)}
                    disabled={isSavingOrUploading}
                    rows={6}
                    placeholder="Nhập nội dung thông tin dinh dưỡng / phác đồ điều trị vào đây..."
                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none disabled:bg-[var(--bg-subtle)] sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t border-[var(--border)] pt-4">
              <button
                disabled={isSavingOrUploading}
                onClick={() => setShowUpload(false)}
                className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                Hủy
              </button>
              {activeTab === "manual" && (
                <button
                  disabled={isSavingOrUploading}
                  onClick={handleManualSubmit}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
                >
                  {isSavingOrUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Đang nạp...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Nạp tri thức
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
