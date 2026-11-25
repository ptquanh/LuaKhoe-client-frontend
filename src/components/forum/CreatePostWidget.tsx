"use client";

import { Image, Mentions, message, Modal } from "antd";
import { getCookie } from "cookies-next";
import {
  Image as ImageIcon,
  Leaf,
  Loader2,
  Send,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ACCESS_TOKEN } from "@/constants/auth";
// Use absolute import or local hook since we already have useCreatePost in hook file
import { useCreatePost as useCreatePostHook } from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";
import { diagnosisService } from "@/services/diagnosis.service";
import { diseaseService } from "@/services/disease.service";
import { forumService } from "@/services/forum.service";
import { userService } from "@/services/user.service";

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

  // Mentions & Diagnosis state
  const [userList, setUserList] = useState<
    {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
    }[]
  >([]);
  const [attachedDiagnosis, setAttachedDiagnosis] = useState<any | null>(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [recentDiagnoses, setRecentDiagnoses] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const handleMentionSearch = async (text: string) => {
    if (!text) {
      setUserList([]);
      return;
    }
    try {
      const res = await userService.searchUsers(text);
      if (res.success && Array.isArray(res.data)) {
        setUserList(res.data);
      }
    } catch (err) {
      console.error("Lỗi tìm kiếm user:", err);
    }
  };

  const fetchRecentDiagnoses = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await diagnosisService.getHistory({ limit: 10 });
      if (res.success && res.data && Array.isArray(res.data.rows)) {
        setRecentDiagnoses(res.data.rows);
      }
    } catch (err) {
      message.error("Không thể tải lịch sử chẩn đoán.");
    } finally {
      setIsHistoryLoading(false);
    }
  };

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

    // Extract tagged usernames using regex from the content text
    const mentionRegex = /(?:^|\s)@([a-zA-Z0-9_.]+)/g;
    const usernames: string[] = [];
    let match;
    while ((match = mentionRegex.exec(trimmed)) !== null) {
      usernames.push(match[1]);
    }
    const finalTaggedUsernames = Array.from(new Set(usernames)).slice(0, 10);

    if (finalTaggedUsernames.length > 0) {
      formData.append("taggedUsernames", finalTaggedUsernames.join(","));
    }

    if (attachedDiagnosis) {
      formData.append("attachedDiagnosisId", attachedDiagnosis.id);
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
        setAttachedDiagnosis(null);
        setUserList([]);

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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm transition-colors">
      {/* 1. Profile information & Category Select */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-3">
          <img
            src={
              avatarUrl ||
              "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
            }
            alt={profileName}
            className="h-10 w-10 rounded-full border border-[var(--border)] object-cover"
          />
          <div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {profileName}
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Đăng bài viết mới
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="create-post-category"
            className="text-[13px] font-semibold text-[var(--text-secondary)]"
          >
            Thể loại:
          </label>
          <select
            id="create-post-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1.5 text-[13px] font-bold text-[var(--primary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Textarea/Mentions with absolute bottom-right AI trigger */}
      <div className="relative">
        <Mentions
          value={content}
          onChange={(val: string) => setContent(val)}
          onSearch={handleMentionSearch}
          placeholder="Nhập nội dung... Gõ @ để nhắc đến ai đó"
          maxLength={5000}
          aria-label="Nội dung bài viết mới"
          className="min-h-[100px] w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-3 pb-14 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none sm:text-sm"
          rows={4}
          variant="borderless"
          filterOption={(input: string, option: any) => {
            const user = userList.find((u) => u.username === option?.value);
            if (!user) return false;
            const fullName =
              [user.lastName, user.firstName].filter(Boolean).join(" ") ||
              user.username;
            const searchStr =
              `${fullName} ${user.username} ${user.email}`.toLowerCase();
            return searchStr.includes(input.toLowerCase());
          }}
          options={userList.map((user: any) => {
            const fullName =
              [user.lastName, user.firstName].filter(Boolean).join(" ") ||
              user.username;
            return {
              value: user.username,
              label: (
                <div className="flex flex-col py-1 text-left">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {fullName}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    @{user.username} • {user.email}
                  </span>
                </div>
              ),
            };
          })}
        />
        <div className="absolute right-2.5 bottom-2.5 z-10 flex items-center gap-2.5">
          <span className="mr-1 text-[11px] font-medium text-[var(--text-muted)] tabular-nums">
            {content.length}/5000
          </span>
          <button
            type="button"
            onClick={handleAiEnhance}
            disabled={isEnhancing || !content.trim()}
            className="flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEnhancing ? (
              <Loader2
                className="h-3.5 w-3.5 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>Cải thiện bằng AI</span>
          </button>
        </div>
      </div>

      {/* Embedded Diagnosis Mini Card Preview */}
      {attachedDiagnosis && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--primary-border)] bg-[var(--bg-subtle)] p-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--primary-border)]">
              <Image
                src={
                  attachedDiagnosis.resultImageUrl ||
                  attachedDiagnosis.originalImageUrl ||
                  "/images/rice-default.png"
                }
                alt="Chẩn đoán"
                preview={false}
                className="object-cover"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-muted)]">
                Đã đính kèm chẩn đoán AI:
              </p>
              <p className="text-sm font-bold text-[var(--primary)]">
                {attachedDiagnosis.results?.[0]?.disease?.name ||
                  "Không phát hiện bệnh hại"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAttachedDiagnosis(null)}
            className="rounded-full p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Image Preview Grid */}
      {previewUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {previewUrls.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--border)]"
            >
              <Image
                src={url || undefined}
                alt={`preview-${idx}`}
                className="object-cover"
                style={{ width: "100%", height: "100%" }}
                preview={{ mask: "Xem trước" }}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                aria-label="Xóa ảnh này"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Suggested chips area using natural language Vietnamese tags */}
      <div className="mt-4 space-y-2.5 border-t border-dashed border-[var(--border)] pt-3">
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
            Chủ đề bài đăng:
          </span>
        </div>

        {/* Selected chips collection (natural format, no '#') */}
        <div className="flex min-h-[36px] flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-2">
          {tags.length === 0 ? (
            <span className="px-1 text-xs text-[var(--text-muted)] italic">
              Chưa chọn chủ đề nào…
            </span>
          ) : (
            tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed="true"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 py-1 text-[13px] font-bold text-[var(--primary)] shadow-xs transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                title="Bấm để xóa thẻ này"
              >
                {tag}
                <X className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
              </button>
            ))
          )}
        </div>

        {/* Suggested unselected tags collection */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-[var(--text-muted)]">
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
                  className="inline-block min-h-9 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1.5 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
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
            className="min-h-10 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--primary)] sm:text-[13px]"
          />
          <button
            type="button"
            onClick={handleAddCustomTag}
            className="min-h-10 cursor-pointer rounded-xl bg-[var(--primary-soft)] px-4 py-1.5 text-[13px] font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
          >
            Thêm
          </button>
        </div>
      </div>

      {/* 4. Action Buttons (Submit & Media upload) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-10 items-center gap-2 rounded-xl px-3 py-1.5 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
          >
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
            <span>Thêm ảnh {images.length > 0 && `(${images.length}/4)`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowDiagnosisModal(true);
              fetchRecentDiagnoses();
            }}
            className="flex min-h-10 items-center gap-2 rounded-xl px-3 py-1.5 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
          >
            <Leaf
              className="h-4 w-4 text-[var(--primary)]"
              aria-hidden="true"
            />
            <span>
              {attachedDiagnosis ? "Đổi chẩn đoán" : "Đính kèm chẩn đoán"}
            </span>
          </button>
        </div>

        <div className="flex gap-2">
          {/* Button 1: Save Draft */}
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={
              !content.trim() || createPostMutation.isPending || isEnhancing
            }
            className="min-h-10 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[var(--primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* 5. Diagnosis Selection Modal */}
      <Modal
        title={
          <span className="text-[17px] font-bold text-[var(--text-primary)]">
            Chọn chẩn đoán đính kèm
          </span>
        }
        open={showDiagnosisModal}
        onCancel={() => setShowDiagnosisModal(false)}
        footer={null}
        width={650}
        styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
      >
        {isHistoryLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Đang tải lịch sử chẩn đoán...
            </p>
          </div>
        ) : recentDiagnoses.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-secondary)]">
            Bà con chưa có lịch sử chẩn đoán lúa bằng AI nào gần đây.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recentDiagnoses.map((diag) => {
              const diagResults = diag.results || [];
              const primaryRes =
                diagResults.length > 0
                  ? [...diagResults].sort(
                      (a, b) => b.confidence - a.confidence,
                    )[0]
                  : null;
              const name =
                primaryRes?.disease?.name || "Không phát hiện bệnh hại";
              const confVal = primaryRes ? Number(primaryRes.confidence) : 0;
              const percent =
                confVal <= 1 ? Math.round(confVal * 100) : Math.round(confVal);
              const dateStr = new Intl.DateTimeFormat("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(diag.createdAt));

              return (
                <div
                  key={diag.id}
                  onClick={() => {
                    setAttachedDiagnosis(diag);
                    setShowDiagnosisModal(false);
                  }}
                  className="flex cursor-pointer gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-2.5 transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/50"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--border)]">
                    <Image
                      src={
                        diag.resultImageUrl ||
                        diag.originalImageUrl ||
                        "/images/rice-default.png"
                      }
                      alt={name}
                      preview={false}
                      className="object-cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="line-clamp-1 text-sm font-bold text-[var(--text-primary)]">
                        {name}
                      </p>
                      {primaryRes && (
                        <p className="text-xs font-semibold text-[var(--primary)] tabular-nums">
                          Độ tin cậy: {percent}%
                        </p>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] tabular-nums">
                      {dateStr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
