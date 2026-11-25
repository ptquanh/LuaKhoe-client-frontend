import { message } from "antd";
import { Loader2, Upload, X } from "lucide-react";
import React, { useState } from "react";

import { useAiModel } from "@/hooks/useAiModel";

interface UploadModelModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadModelModal({
  onClose,
  onSuccess,
}: UploadModelModalProps) {
  const { uploadModel, isUploading } = useAiModel();
  const [versionName, setVersionName] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".onnx")) {
        setSelectedFile(file);
      } else {
        message.error("Chỉ chấp nhận tệp tin định dạng .onnx");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".onnx")) {
        setSelectedFile(file);
      } else {
        message.error("Chỉ chấp nhận tệp tin định dạng .onnx");
      }
    }
  };

  const handleUpload = async () => {
    if (!versionName.trim()) {
      message.error("Vui lòng nhập Version Name!");
      return;
    }
    if (!selectedFile) {
      message.error("Vui lòng chọn hoặc kéo thả tệp tin .onnx!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("versionName", versionName.trim());
      formData.append("releaseNotes", releaseNotes.trim());
      formData.append("isActive", "false");

      const res = await uploadModel(formData);

      if (res.success) {
        message.success("Upload và khởi tạo model thành công!");
        onSuccess();
        onClose();
      } else {
        message.error(res.message || "Upload model thất bại");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Đã xảy ra lỗi khi gọi API upload";
      message.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xl transition-all">
        {/* Full Modal Glassmorphic Lock Overlay to prevent user escape */}
        {isUploading && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--bg-card)]/90 p-6 text-center backdrop-blur-[1px]">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)]" />
            <h4 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
              Đang tải lên và cấu hình Model AI
            </h4>
            <p className="mt-2 max-w-[320px] text-[13px] text-[var(--text-secondary)]">
              Tệp tin (~94MB) đang được tải trực tiếp lên Cloudflare R2 và khởi
              tạo Inference Session. Vui lòng không đóng trình duyệt hoặc tải
              lại trang!
            </p>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Upload Model YOLO mới
          </h3>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              Version Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              disabled={isUploading}
              placeholder="Ví dụ: v3.3.0"
              className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none disabled:bg-[var(--bg-subtle)] disabled:text-[var(--text-muted)] sm:text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              ONNX Binary File <span className="text-red-500">*</span>
            </label>
            <div
              onDragEnter={!isUploading ? handleDrag : undefined}
              onDragOver={!isUploading ? handleDrag : undefined}
              onDragLeave={!isUploading ? handleDrag : undefined}
              onDrop={!isUploading ? handleDrop : undefined}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
                isUploading
                  ? "cursor-not-allowed border-[var(--border)] bg-[var(--bg-subtle)]"
                  : dragActive || selectedFile
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]/50"
                    : "border-[var(--border-strong)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {!isUploading && (
                <input
                  type="file"
                  accept=".onnx"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              )}
              <Upload
                className={`h-8 w-8 ${selectedFile ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}
              />
              <p className="mt-2 text-center text-sm font-medium text-[var(--text-primary)]">
                {selectedFile
                  ? selectedFile.name
                  : "Kéo thả file .onnx hoặc click để chọn"}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)] tabular-nums">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "Định dạng cho phép: .onnx"}
              </p>
              {selectedFile && !isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-3 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                >
                  Xóa file đã chọn
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              Release Notes
            </label>
            <textarea
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              disabled={isUploading}
              rows={3}
              placeholder="Mô tả các thay đổi hoặc độ chính xác mAP..."
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none disabled:bg-[var(--bg-subtle)] disabled:text-[var(--text-muted)] sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? "Đang xử lý tải lên R2 (Vui lòng đợi)..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
