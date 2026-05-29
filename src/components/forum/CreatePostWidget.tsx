"use client";

import { ACCESS_TOKEN } from "@/constants/auth";
import { useProfile } from "@/hooks/useProfile";
import { diseaseService } from "@/services/disease.service";
import { forumService } from "@/services/forum.service";
import { message } from "antd";
import { getCookie } from "cookies-next";
import {
  Image as ImageIcon,
  Loader2,
  Send,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Use absolute import or local hook since we already have useCreatePost in hook file
import { useCreatePost as useCreatePostHook } from "@/hooks/useForum";

// 1. Các chủ đề cố định (Nghiệp vụ diễn đàn)
const STATIC_TAGS = ["Hỏi đáp", "Kinh nghiệm", "Phân bón", "Kỹ thuật sạ"];

const CATEGORIES = ["Hỏi đáp", "Kinh nghiệm", "Thảo luận chung"];

export default function CreatePostWidget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("Hỏi đáp");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [customTagInput, setCustomTagInput] = useState(""); // Custom tag input state
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State lưu danh sách gợi ý tổng hợp
  const [suggestedTags, setSuggestedTags] = useState<string[]>(STATIC_TAGS);

  useEffect(() => {
    // 2. Fetch danh sách bệnh từ API khi load component
    const fetchDiseaseTags = async () => {
      try {
        const response = await diseaseService.getDiseases();
        if (response?.success && Array.isArray(response.data)) {
          // Trích xuất tên bệnh và giới hạn số lượng (Ví dụ: Lấy 5 bệnh đầu tiên/phổ biến nhất)
          const diseaseTags = response.data
            .slice(0, 5)
            .map((disease) => disease.name);

          // Trộn thẻ tĩnh và thẻ từ API (Ưu tiên bệnh lên trước hoặc sau tùy bạn)
          setSuggestedTags([...diseaseTags, ...STATIC_TAGS]);
        }
      } catch (error) {
        console.error("Không thể tải danh sách bệnh:", error);
        // Fallback: Nếu API lỗi, vẫn giữ nguyên STATIC_TAGS
      }
    };

    fetchDiseaseTags();
  }, []);

  // Keep track of preview URLs to revoke them on unmount
  const activePreviewsRef = useRef<string[]>([]);
  useEffect(() => {
    activePreviewsRef.current = previewUrls;
  }, [previewUrls]);

  useEffect(() => {
    return () => {
      activePreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        message.error(`Ảnh ${file.name} vượt quá dung lượng 5MB cho phép!`);
        continue;
      }

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        message.error(`Định dạng tệp ${file.name} không hỗ trợ!`);
        continue;
      }

      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    }

    if (images.length + validFiles.length > 4) {
      message.warning("Bà con chỉ được chọn tối đa 4 ảnh cho mỗi bài viết.");
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages((prev) => prev.filter((_, idx) => idx !== index));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const { profile } = useProfile();
  const createPostMutation = useCreatePostHook();

  const profileName = (() => {
    if (!profile) return "Thành viên";
    const subProfile = profile.farmerProfile || profile.adminProfile;
    const first = subProfile?.firstName || "";
    const last = subProfile?.lastName || "";
    return `${last} ${first}`.trim() || profile.username || "Thành viên";
  })();

  const avatarUrl = profile?.avatarUrl || "";

  // Core normalization function: lowercase and strip spaces/hashes for case-insensitive duplicate check
  const normalizeTag = (tag: string) => {
    return tag.toLowerCase().replace(/[\s#]/g, "");
  };

  // Checks if tag already exists (case and space insensitive)
  const isTagExists = (newTag: string) => {
    const normalizedNew = normalizeTag(newTag);
    return tags.some(
      (existingTag) => normalizeTag(existingTag) === normalizedNew,
    );
  };

  // Dynamic chip toggler: tap to select/deselect
  const toggleTag = (tagToToggle: string) => {
    if (isTagExists(tagToToggle)) {
      // Exists -> Remove it
      setTags(
        tags.filter((tag) => normalizeTag(tag) !== normalizeTag(tagToToggle)),
      );
    } else {
      // Doesn't exist -> Add it
      setTags([...tags, tagToToggle]);
    }
  };

  // Add custom tag entered by farmer manually
  const handleAddCustomTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = customTagInput.trim();
    if (!trimmed) return;

    // FRONTEND FILTER: Strip out excessive whitespace and duplicate # characters
    const cleanString = trimmed.replace(/#/g, "").trim().replace(/\s+/g, " ");

    if (cleanString.length > 0 && !isTagExists(cleanString)) {
      // Sentence casing (e.g. "bạc lá" -> "Bạc lá")
      const formattedTag =
        cleanString.charAt(0).toUpperCase() +
        cleanString.slice(1).toLowerCase();
      setTags([...tags, formattedTag]);
    }
    setCustomTagInput("");
  };

  const handleAiEnhance = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      message.warning(
        "Bà con vui lòng nhập nội dung nháp trước khi nhờ AI hỗ trợ nhé!",
      );
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await forumService.aiEnhanceContent(trimmed);
      if (response.success && response.data) {
        const {
          enhancedContent,
          hashtags,
          category: suggestedCategory,
        } = response.data;

        setContent(enhancedContent);
        setCategory(suggestedCategory || "Thảo luận chung");
        setTags(hashtags || []);

        message.success("Trợ lý AI đã tối ưu và phân loại bài đăng xong!");
      } else {
        throw new Error("API response error");
      }
    } catch (err) {
      // Fallback safety: Keep current content, suggest default metadata
      setTags(["Lúa Khỏe", "Nông nghiệp"]);
      setCategory("Thảo luận chung");
      message.info(
        "Trợ lý AI đang bận. Đã tự động gán thẻ phân loại mặc định!",
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (submitAsDraft: boolean) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    if (trimmed.length < 10) {
      message.error("Nội dung bài viết phải chứa ít nhất 10 ký tự!");
      return;
    }

    if (trimmed.length > 5000) {
      message.error("Nội dung bài viết không được vượt quá 5000 ký tự!");
      return;
    }

    const formData = new FormData();
    formData.append("content", trimmed);
    formData.append("category", category);
    if (submitAsDraft) {
      formData.append("isDraft", "true");
    }

    const postTags = tags.length > 0 ? tags : ["Hỏi đáp"];
    postTags.forEach((tag) => {
      formData.append("tags", tag);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    createPostMutation.mutate(formData, {
      onSuccess: () => {
        setContent("");
        setTags([]);
        setCategory("Hỏi đáp");

        // Reset image state
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setImages([]);
        setPreviewUrls([]);
      },
    });
  };

  const hasToken =
    typeof window !== "undefined" ? !!getCookie(ACCESS_TOKEN) : false;

  if (!mounted || !hasToken) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900">
      {/* 1. Profile information & Category Select */}
      <div className="mb-3 flex items-center justify-between border-b border-[#E0E0E0] pb-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={profileName}
            className="h-10 w-10 rounded-full border border-gray-100 object-cover dark:border-gray-800"
          />
          <div>
            <span className="text-[14px] font-[600] text-[#1B1B1B] dark:text-gray-100">
              {profileName}
            </span>
            <p className="text-[11px] text-[#9E9E9E] dark:text-gray-500">
              Đăng bài viết mới
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="create-post-category"
            className="text-[13px] font-semibold text-[#5C5C5C] dark:text-gray-400"
          >
            Thể loại:
          </label>
          <select
            id="create-post-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1.5 text-[13px] font-bold text-[#2F9E44] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-emerald-400"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Textarea with absolute bottom-right AI trigger */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bà con đang gặp vấn đề gì về lúa, thắc mắc bệnh hại hay có kinh nghiệm bổ ích muốn chia sẻ…"
          maxLength={5000}
          aria-label="Nội dung bài viết mới"
          className="w-full resize-none rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] p-3 pb-14 text-[14px] text-[#1B1B1B] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          rows={4}
        />
        <div className="absolute right-2.5 bottom-2.5 flex items-center gap-2.5">
          <span className="mr-1 text-[11px] font-medium text-[#9E9E9E] dark:text-gray-500">
            {content.length}/5000
          </span>
          <button
            type="button"
            onClick={handleAiEnhance}
            disabled={isEnhancing || !content.trim()}
            className="flex animate-pulse items-center gap-1.5 rounded-lg border border-[#2F9E44]/20 bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-[#2F9E44] transition-all hover:bg-[#E6F4EA] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20"
          >
            {isEnhancing ? (
              <Loader2
                className="h-3.5 w-3.5 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Sparkles
                className="h-3.5 w-3.5 text-[#2F9E44]"
                aria-hidden="true"
              />
            )}
            <span>Cải thiện bằng AI</span>
          </button>
        </div>
      </div>

      {/* Image Preview Grid */}
      {previewUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {previewUrls.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <img
                src={url}
                alt={`preview-${idx}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                aria-label="Xóa ảnh này"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Suggested chips area using natural language Vietnamese tags */}
      <div className="mt-4 space-y-2.5 border-t border-dashed border-gray-100 pt-3 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-[#2F9E44]" aria-hidden="true" />
          <span className="text-[13px] font-semibold text-[#5C5C5C] dark:text-gray-400">
            Chủ đề bài đăng:
          </span>
        </div>

        {/* Selected chips collection (natural format, no '#') */}
        <div className="flex min-h-[32px] flex-wrap gap-2 rounded-lg border border-emerald-500/5 bg-emerald-50/10 p-2 dark:bg-emerald-950/5">
          {tags.length === 0 ? (
            <span className="text-[12px] text-gray-400 italic">
              Chưa chọn chủ đề nào…
            </span>
          ) : (
            tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed="true"
                className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-emerald-500/10 bg-[#E6F4EA] px-3 py-1.5 text-[13px] font-bold text-[#2F9E44] shadow-xs transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:bg-emerald-950/40 dark:text-emerald-400"
                title="Bấm để xóa thẻ này"
              >
                {tag}
                <span
                  className="ml-1 text-[11px] font-extrabold opacity-75"
                  aria-hidden="true"
                >
                  ✕
                </span>
              </button>
            ))
          )}
        </div>

        {/* Suggested unselected tags collection */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
            Gợi ý nhấp chọn nhanh:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags
              .filter((tag) => !isTagExists(tag))
              .map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={isTagExists(tag)}
                  className="dark:border-gray-850 inline-block cursor-pointer rounded-md border border-gray-100 bg-[#F7F7F7] px-3 py-1.5 text-[13px] font-semibold text-[#5C5C5C] transition-all hover:bg-[#E6F4EA] hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-[#2F9E44]/20"
                >
                  + {tag}
                </button>
              ))}
          </div>
        </div>

        {/* Ô nhập thẻ TÙY CHỈNH */}
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag(e)}
            placeholder="Nhập chủ đề khác (Ví dụ: bệnh sâu đục thân)…"
            aria-label="Nhập chủ đề tùy chỉnh"
            className="flex-1 rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1.5 text-[13px] text-[#1B1B1B] placeholder-[#9E9E9E] outline-none focus:border-[#2F9E44] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddCustomTag}
            className="rounded-lg bg-[#2F9E44]/10 px-4 py-1.5 text-[13px] font-semibold text-[#2F9E44] transition hover:bg-[#2F9E44]/20 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          >
            Thêm
          </button>
        </div>
      </div>

      {/* 4. Action Buttons (Submit & Media upload) */}
      <div className="mt-4 flex items-center justify-between border-t border-[#E0E0E0] pt-3 dark:border-gray-800">
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-[600] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <ImageIcon className="h-4 w-5" aria-hidden="true" />
          <span>Thêm ảnh {images.length > 0 && `(${images.length}/4)`}</span>
        </button>

        <div className="flex gap-2">
          {/* Button 1: Save Draft */}
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={
              !content.trim() || createPostMutation.isPending || isEnhancing
            }
            className="dark:text-gray-250 rounded-lg bg-gray-100 px-4 py-2 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Lưu nháp
          </button>

          {/* Button 2: Publish */}
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={
              !content.trim() || createPostMutation.isPending || isEnhancing
            }
            className="flex items-center gap-2 rounded-lg bg-[#2F9E44] px-5 py-2 text-[14px] font-bold text-white shadow-xs transition hover:bg-[#1F6F2E] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createPostMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            <span>Đăng bài</span>
          </button>
        </div>
      </div>
    </div>
  );
}
