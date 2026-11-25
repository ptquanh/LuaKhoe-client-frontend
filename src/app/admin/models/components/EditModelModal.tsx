import { message } from "antd";
import { Loader2, Save, Upload, X } from "lucide-react";
import React, { useState } from "react";

import { useAiModel } from "@/hooks/useAiModel";
import { AiModel } from "@/types/ai-model.type";

interface EditModelModalProps {
  model: AiModel;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditModelModal({
  model,
  onClose,
  onSuccess,
}: EditModelModalProps) {
  const { updateModel, isUpdating } = useAiModel();
  const [versionName, setVersionName] = useState(model.versionName || "");
  const [releaseNotes, setReleaseNotes] = useState(model.releaseNotes || "");
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

  const handleSave = async () => {
    if (!versionName.trim()) {
      message.error("Vui lòng nhập Version Name!");
      return;
    }

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("versionName", versionName.trim());
      formData.append("releaseNotes", releaseNotes.trim());

      const res = await updateModel({ id: model.id, payload: formData });

      if (res.success) {
        message.success("Cập nhật mô hình AI thành công!");
        onSuccess();
        onClose();
      } else {
        message.error(res.message || "Cập nhật mô hình thất bại");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Đã xảy ra lỗi khi gọi API chỉnh sửa";
      message.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xl transition-all">
        {/* Full Modal Glassmorphic Lock Overlay to prevent user escape */}
        {isUpdating && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--bg-card)]/90 p-6 text-center backdrop-blur-[1px]">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)]" />
            <h4 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
              Đang chỉnh sửa và cấu hình lại Model AI
            </h4>
            <p className="mt-2 max-w-[320px] text-[13px] text-[var(--text-secondary)]">
              Tệp tin và thông tin mới đang được ghi đè lên Cloudflare R2, hệ
              thống đang tự động thay thế local cache và nạp lại mô hình. Vui
              lòng không đóng trình duyệt hoặc tải lại trang!
            </p>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Chỉnh sửa mô hình AI
            </h3>
            <span className="text-xs text-[var(--text-muted)]">
              Model ID:{" "}
              <span className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                {model.id}
              </span>
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
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
              disabled={isUpdating}
              placeholder="Ví dụ: v3.3.0"
              className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none disabled:bg-[var(--bg-subtle)] disabled:text-[var(--text-muted)] sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              Ghi đè ONNX Binary File{" "}
              <span className="text-xs font-normal text-[var(--text-muted)]">
                (Tùy chọn)
              </span>
            </label>
            <div
              onDragEnter={!isUpdating ? handleDrag : undefined}
              onDragOver={!isUpdating ? handleDrag : undefined}
              onDragLeave={!isUpdating ? handleDrag : undefined}
              onDrop={!isUpdating ? handleDrop : undefined}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
                isUpdating
                  ? "cursor-not-allowed border-[var(--border)] bg-[var(--bg-subtle)]"
                  : dragActive || selectedFile
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]/50"
                    : "border-[var(--border-strong)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {!isUpdating && (
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
              <p className="mt-2 max-w-[280px] text-center text-sm font-medium text-[var(--text-primary)]">
                {selectedFile
                  ? selectedFile.name
                  : "Kéo thả file .onnx mới vào đây để ghi đè file cũ (Bỏ trống để giữ nguyên)"}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)] tabular-nums">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "Định dạng cho phép: .onnx"}
              </p>
              {selectedFile && !isUpdating && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-3 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                >
                  Bỏ chọn file mới
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
              disabled={isUpdating}
              rows={3}
              placeholder="Mô tả các thay đổi hoặc độ chính xác mAP..."
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none disabled:bg-[var(--bg-subtle)] disabled:text-[var(--text-muted)] sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
