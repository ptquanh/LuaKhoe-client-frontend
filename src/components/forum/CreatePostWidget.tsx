"use client";

import { useCreatePost } from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";
import { message } from "antd";
import { Image as ImageIcon, Loader2, Send } from "lucide-react";
import { useState } from "react";

export default function CreatePostWidget() {
  const [content, setContent] = useState("");
  const { profile } = useProfile();
  const createPostMutation = useCreatePost();

  const profileName = (() => {
    if (!profile) return "Thành viên";
    const subProfile = profile.farmerProfile || profile.adminProfile;
    const first = subProfile?.firstName || "";
    const last = subProfile?.lastName || "";
    return `${last} ${first}`.trim() || profile.username || "Thành viên";
  })();

  const avatarUrl = profile?.avatarUrl || "";

  const handleSubmit = async () => {
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

    try {
      await createPostMutation.mutateAsync({
        content: trimmed,
        tags: ["Hỏi đáp"], // Add a default tag
      });
      message.success("Đăng bài viết thành công!");
      setContent("");
    } catch (err: any) {
      message.error(err.message || "Không thể đăng bài viết.");
    }
  };

  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex gap-3">
        <img
          src={avatarUrl}
          alt={profileName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="relative flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Bà con có thắc mắc gì không, ${profileName}?`}
            maxLength={5000}
            className="w-full resize-none rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] p-3 pb-8 text-[14px] text-[#1B1B1B] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-[#2F9E44]"
            rows={2}
          />
          <span className="absolute right-3 bottom-2 text-[11px] font-medium text-[#9E9E9E] dark:text-gray-500">
            {content.length}/5000
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#E0E0E0] pt-3 dark:border-gray-800">
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] hover:text-[#2F9E44] dark:text-gray-400 dark:hover:bg-gray-800">
          <ImageIcon className="h-5 w-5" />
          <span>Thêm ảnh</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || createPostMutation.isPending}
          className="flex items-center gap-2 rounded-lg bg-[#2F9E44] px-4 py-2 text-[14px] font-[600] text-white transition-colors hover:bg-[#1F6F2E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createPostMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>Đăng bài</span>
        </button>
      </div>
    </div>
  );
}
