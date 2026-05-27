"use client";

import { useState } from "react";
import { ForumComment } from "@/types/forum.type";
import CommentItem from "./CommentItem";
import { MOCK_CURRENT_USER } from "@/services/mock/forum.mock";
import { Send } from "lucide-react";

interface CommentSectionProps {
  comments: ForumComment[];
}

export default function CommentSection({ comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    // Mock submit
    console.log("Submit comment:", newComment);
    setNewComment("");
  };

  return (
    <div className="mt-6 rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm md:p-6">
      <h3 className="text-[18px] font-[600] text-[#1B1B1B] mb-6">Bình luận ({comments.length})</h3>

      {/* Comment Input */}
      <div className="flex gap-3 mb-8">
        {MOCK_CURRENT_USER.avatarUrl ? (
          <img
            src={MOCK_CURRENT_USER.avatarUrl}
            alt={MOCK_CURRENT_USER.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] font-semibold text-[#2F9E44]">
            {MOCK_CURRENT_USER.name.charAt(0)}
          </div>
        )}
        <div className="flex flex-1 items-end gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full resize-none rounded-xl border border-[#E0E0E0] bg-[#F7F7F7] p-3 text-[14px] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:outline-none"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="flex shrink-0 items-center justify-center rounded-xl bg-[#2F9E44] p-3 text-white transition-colors hover:bg-[#1F6F2E] disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-2">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
