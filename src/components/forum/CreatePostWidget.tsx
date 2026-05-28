"use client";

import { Image as ImageIcon, Send } from "lucide-react";
import { useState } from "react";
import { MOCK_CURRENT_USER } from "@/services/mock/forum.mock";

export default function CreatePostWidget() {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    // In real app, this would trigger an API call or React Query mutation
    console.log("Submit post:", content);
    setContent("");
  };

  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        {MOCK_CURRENT_USER.avatarUrl ? (
          <img
            src={MOCK_CURRENT_USER.avatarUrl}
            alt={MOCK_CURRENT_USER.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F4EA] font-semibold text-[#2F9E44]">
            {MOCK_CURRENT_USER.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Bà con có thắc mắc gì không, ${MOCK_CURRENT_USER.name}?`}
            className="w-full resize-none rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] p-3 text-[14px] text-[#1B1B1B] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none"
            rows={2}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#E0E0E0] pt-3">
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] hover:text-[#2F9E44]">
          <ImageIcon className="h-5 w-5" />
          <span>Thêm ảnh</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="flex items-center gap-2 rounded-lg bg-[#2F9E44] px-4 py-2 text-[14px] font-[600] text-white transition-colors hover:bg-[#1F6F2E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>Đăng bài</span>
        </button>
      </div>
    </div>
  );
}
