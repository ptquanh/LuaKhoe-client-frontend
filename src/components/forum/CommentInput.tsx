"use client";

import { Image, message } from "antd";
import { Camera, Loader2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CommentInputProps {
  placeholder?: string;
  submitLabel?: string;
  isPending?: boolean;
  onSubmit: (content: string, image: File | null) => Promise<void>;
  avatarUrl?: string;
  profileName?: string;
}

export default function CommentInput({
  placeholder = "Viết bình luận của bạn…",
  isPending = false,
  onSubmit,
  avatarUrl,
  profileName = "Thành viên",
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up URL object on unmount to prevent memory leaks
  const activePreviewRef = useRef<string | null>(null);
  useEffect(() => {
    activePreviewRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (activePreviewRef.current) {
        URL.revokeObjectURL(activePreviewRef.current);
      }
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error("Ảnh vượt quá dung lượng 5MB cho phép!");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      message.error("Định dạng tệp không được hỗ trợ!");
      return;
    }

    // Revoke old URL first if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitClick = async () => {
    const trimmed = content.trim();
    if (!trimmed && !image) return;

    if (trimmed.length > 1000) {
      message.error("Nội dung không được vượt quá 1000 ký tự!");
      return;
    }

    try {
      await onSubmit(trimmed, image);
      setContent("");
      removeImage();
    } catch (err) {
      // Errors are handled by the caller mutation
    }
  };

  const inputArea = (
    <div className="flex flex-1 flex-col gap-2">
      {/* Image Preview Thumbnail */}
      {previewUrl && (
        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-[var(--border)]">
          <Image
            src={previewUrl || undefined}
            alt="Preview attachment"
            className="object-cover"
            style={{ width: "100%", height: "100%" }}
            preview={{ mask: "Xem trước" }}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
            aria-label="Hủy ảnh đính kèm"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            maxLength={1000}
            aria-label={placeholder}
            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-3 pr-12 pb-8 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitClick();
              }
            }}
          />
          <span className="absolute right-3 bottom-2 text-[10px] font-medium text-[var(--text-muted)] tabular-nums">
            {content.length}/1000
          </span>

          {/* Hidden File input */}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />

          {/* Camera Trigger Icon button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Đính kèm ảnh"
            className="absolute top-2 right-2 rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={(!content.trim() && !image) || isPending}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] p-3 text-white transition-colors hover:bg-[var(--primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );

  if (avatarUrl) {
    return (
      <div className="flex gap-3">
        <img
          src={
            avatarUrl ||
            "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
          }
          alt={profileName}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        {inputArea}
      </div>
    );
  }

  return inputArea;
}
