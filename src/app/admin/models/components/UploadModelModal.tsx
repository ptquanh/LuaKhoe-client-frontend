import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { message } from "antd";
import { aiModelService } from "@/services/ai-model.service";

interface UploadModelModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadModelModal({
  onClose,
  onSuccess,
}: UploadModelModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    versionName: "",
    releaseNotes: "",
    filePath: "",
  });

  const handleUpload = async () => {
    if (!form.versionName.trim() || !form.filePath.trim()) {
      message.error("Vui lòng nhập đủ Version và File Path!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await aiModelService.createModel({
        versionName: form.versionName,
        releaseNotes: form.releaseNotes,
        filePath: form.filePath,
        isActive: false,
      });

      if (res.success) {
        message.success("Upload model thành công!");
        onSuccess();
        onClose();
      } else {
        message.error(res.message || "Upload model thất bại");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi gọi API upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[500px] rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-[600] text-[#1B1B1B]">
            Upload Model mới
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-[#F0F2F5]"
          >
            <X className="h-5 w-5 text-[#5C5C5C]" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[14px] text-[#1B1B1B]">
              Version Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.versionName}
              onChange={(e) =>
                setForm({ ...form, versionName: e.target.value })
              }
              placeholder="Ví dụ: v3.3.0"
              className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[14px] text-[#1B1B1B]">
              File Path / URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.filePath}
              onChange={(e) => setForm({ ...form, filePath: e.target.value })}
              placeholder="URL hoặc đường dẫn S3, GCS..."
              className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[14px] text-[#1B1B1B]">
              Release Notes
            </label>
            <textarea
              value={form.releaseNotes}
              onChange={(e) =>
                setForm({ ...form, releaseNotes: e.target.value })
              }
              rows={3}
              placeholder="Mô tả thay đổi..."
              className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5]"
          >
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={isSubmitting}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] text-white hover:bg-[#1F6F2E] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isSubmitting ? "Đang xử lý..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
