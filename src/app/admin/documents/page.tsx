"use client";

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
      alert("Từ khóa tìm kiếm phải có tối thiểu 3 ký tự.");
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

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đoạn tri thức dinh dưỡng này?")) {
      try {
        await deleteChunk(id);
      } catch (err) {
        console.error("Lỗi khi xóa chunk:", err);
      }
    }
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
      alert("Chỉ hỗ trợ nạp tệp định dạng .txt, .md hoặc .pdf.");
      return;
    }

    try {
      await uploadFile(file);
      setShowUpload(false);
    } catch (err) {
      console.error("Lỗi nạp tệp:", err);
      alert("Lỗi khi nạp nội dung tệp. Vui lòng thử lại.");
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
      alert("Vui lòng điền đầy đủ nguồn và nội dung kiến thức.");
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
      // Clear forms
      setManualContent("");
      setManualSource("");
      setShowUpload(false);
    } catch (err) {
      console.error("Lỗi thêm tri thức:", err);
      alert("Lỗi khi thêm tri thức. Vui lòng thử lại.");
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            Cơ sở tri thức dinh dưỡng
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            Tổng số:{" "}
            <span className="font-[600] text-[#2F9E44]">{totalChunks}</span>{" "}
            mảnh tri thức (chunks)
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E]"
        >
          <Upload className="h-4 w-4" /> Nạp tri thức mới
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-[#E0E0E0] bg-white p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="min-w-[200px] flex-1">
            <label className="mb-1.5 block text-[13px] font-[600] text-[#5C5C5C]">
              Tìm nội dung
            </label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9E9E9E]" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="h-10 w-full rounded-lg border border-[#E0E0E0] pr-3 pl-10 text-[14px] focus:border-[#2F9E44] focus:outline-none"
              />
            </div>
          </div>

          <div className="min-w-[180px] flex-1">
            <label className="mb-1.5 block text-[13px] font-[600] text-[#5C5C5C]">
              Nguồn tài liệu
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Nhập tên nguồn..."
              className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
            />
          </div>

          <div className="w-[160px]">
            <label className="mb-1.5 block text-[13px] font-[600] text-[#5C5C5C]">
              Định dạng
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-3 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
            >
              <option value="">Tất cả định dạng</option>
              <option value=".pdf">PDF (.pdf)</option>
              <option value=".txt">Text (.txt)</option>
              <option value=".md">Markdown (.md)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="h-10 cursor-pointer rounded-lg bg-[#2F9E44] px-5 text-[14px] font-[600] text-white hover:bg-[#1F6F2E]"
            >
              Tìm kiếm
            </button>
            {(keyword || source || format) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-[#E0E0E0] bg-white px-4 text-[14px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5]"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-[#E0E0E0] bg-white">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#2F9E44]" />
            <p className="text-[14px] text-[#5C5C5C]">
              Đang tải dữ liệu tri thức...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F0F2F5]">
                  <th className="h-12 w-[180px] px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                    Nguồn tài liệu
                  </th>
                  <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                    Nội dung mảnh tri thức (Chunk)
                  </th>
                  <th className="hidden h-12 w-[150px] px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                    Định dạng
                  </th>
                  <th className="hidden h-12 w-[180px] px-4 text-left text-[13px] font-[600] text-[#1B1B1B] lg:table-cell">
                    Thời gian tạo
                  </th>
                  <th className="h-12 w-20 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                    Xóa
                  </th>
                </tr>
              </thead>
              <tbody>
                {chunks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-[14px] text-[#5C5C5C]"
                    >
                      Không tìm thấy dữ liệu tri thức nào. Hãy thêm tri thức
                      mới.
                    </td>
                  </tr>
                ) : (
                  chunks.map((c: any, i: number) => {
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
                        className={`border-t border-[#E0E0E0] hover:bg-[#F5F7F9] ${
                          i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-3 align-top font-[500] text-[#1B1B1B]">
                          <div className="flex max-w-[170px] items-start gap-1.5">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#5C5C5C]" />
                            <span className="text-[13px] leading-tight break-words">
                              {c.source || "Không rõ nguồn"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-col gap-1">
                            <div
                              className={`text-[13.5px] leading-relaxed whitespace-pre-line text-[#333333] ${
                                expandedIds.has(c.id) ? "" : "line-clamp-3"
                              }`}
                            >
                              {c.content}
                            </div>
                            {c.content.length > 150 && (
                              <button
                                onClick={() => toggleExpand(c.id)}
                                className="mt-1 cursor-pointer self-start text-[12px] font-[600] text-[#2F9E44] hover:underline"
                              >
                                {expandedIds.has(c.id) ? "Thu gọn" : "Xem thêm"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 text-center align-top md:table-cell">
                          <span className="rounded bg-[#F0F2F5] px-2 py-0.5 text-[11px] font-[600] text-[#5C5C5C]">
                            {fileType}
                          </span>
                        </td>
                        <td className="hidden px-4 py-3 align-top text-[12px] text-[#5C5C5C] lg:table-cell">
                          {lastUpdated}
                        </td>
                        <td className="px-4 py-3 text-center align-top">
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#E53935] hover:bg-[#FFEBEE]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[12px] text-[#5C5C5C]">
                Hiển thị {offset + 1}–{Math.min(offset + limit, totalChunks)} /{" "}
                {totalChunks}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPage}
                  disabled={offset === 0}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setOffset((p - 1) * limit)}
                      className={`h-8 w-8 cursor-pointer rounded-md text-[14px] font-[500] ${p === currentPage ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={handleNextPage}
                  disabled={offset + limit >= totalChunks}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40"
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
          <div className="w-full max-w-[550px] rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-[#F0F0F0] pb-3">
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
                Nạp tri thức dinh dưỡng RAG
              </h3>
              <button
                disabled={isSavingOrUploading}
                onClick={() => setShowUpload(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-[#F0F2F5] disabled:opacity-50"
              >
                <X className="h-5 w-5 text-[#5C5C5C]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex border-b border-[#E0E0E0]">
              <button
                disabled={isSavingOrUploading}
                onClick={() => setActiveTab("file")}
                className={`mr-6 cursor-pointer border-b-2 pb-2 text-[14px] font-[600] transition-all ${
                  activeTab === "file"
                    ? "border-[#2F9E44] text-[#2F9E44]"
                    : "border-transparent text-[#5C5C5C] hover:text-[#1B1B1B]"
                }`}
              >
                Tải tệp văn bản
              </button>
              <button
                disabled={isSavingOrUploading}
                onClick={() => setActiveTab("manual")}
                className={`cursor-pointer border-b-2 pb-2 text-[14px] font-[600] transition-all ${
                  activeTab === "manual"
                    ? "border-[#2F9E44] text-[#2F9E44]"
                    : "border-transparent text-[#5C5C5C] hover:text-[#1B1B1B]"
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
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                    dragOver
                      ? "scale-[0.99] border-[#2F9E44] bg-[#E6F4EA]/30"
                      : "border-[#E0E0E0] hover:border-[#2F9E44] hover:bg-[#FAFAFA]"
                  } ${isSavingOrUploading ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {isSavingOrUploading ? (
                    <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-[#2F9E44]" />
                  ) : (
                    <Upload className="mx-auto mb-3 h-10 w-10 text-[#5C5C5C]" />
                  )}
                  <p className="text-[14px] font-[600] text-[#1B1B1B]">
                    {isSavingOrUploading
                      ? "Đang tải lên & xử lý dữ liệu..."
                      : "Kéo thả hoặc click để chọn file"}
                  </p>
                  <p className="mt-1 text-[12px] text-[#9E9E9E]">
                    Hỗ trợ định dạng tệp: .txt, .md, .pdf (tối đa 20MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[13px] font-[600] text-[#1B1B1B]">
                    Nguồn tài liệu
                  </label>
                  <input
                    type="text"
                    value={manualSource}
                    onChange={(e) => setManualSource(e.target.value)}
                    disabled={isSavingOrUploading}
                    placeholder="Ví dụ: Giáo trình trồng lúa Cần Thơ, Chương 2"
                    className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none disabled:bg-[#F9FAFB]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-[600] text-[#1B1B1B]">
                    Nội dung mảnh tri thức (Chunk)
                  </label>
                  <textarea
                    value={manualContent}
                    onChange={(e) => setManualContent(e.target.value)}
                    disabled={isSavingOrUploading}
                    rows={6}
                    placeholder="Nhập nội dung thông tin dinh dưỡng / phác đồ điều trị vào đây..."
                    className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none disabled:bg-[#F9FAFB]"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t border-[#F0F0F0] pt-4">
              <button
                disabled={isSavingOrUploading}
                onClick={() => setShowUpload(false)}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:opacity-50"
              >
                Hủy
              </button>
              {activeTab === "manual" && (
                <button
                  disabled={isSavingOrUploading}
                  onClick={handleManualSubmit}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E] disabled:opacity-50"
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
