"use client";

import { MessageSquare, MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { ForumComment } from "@/types/forum.type";

interface CommentItemProps {
  comment: ForumComment;
  isReply?: boolean;
}

export default function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleUpvote = () => setVote(vote === "up" ? null : "up");
  const handleDownvote = () => setVote(vote === "down" ? null : "down");

  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(comment.createdAt));

  return (
    <div className={`flex gap-3 ${isReply ? 'mt-4' : 'mt-5'}`}>
      {/* Avatar */}
      {comment.author.avatarUrl ? (
        <img
          src={comment.author.avatarUrl}
          alt={comment.author.name}
          className={`${isReply ? 'h-8 w-8' : 'h-10 w-10'} shrink-0 rounded-full object-cover`}
        />
      ) : (
        <div className={`flex ${isReply ? 'h-8 w-8 text-[12px]' : 'h-10 w-10'} shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] font-semibold text-[#2F9E44]`}>
          {comment.author.name.charAt(0)}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1">
        <div className="rounded-2xl bg-[#F0F2F5] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-[600] text-[#1B1B1B] text-[14px]">{comment.author.name}</span>
            {comment.author.role === "expert" && (
              <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-[500] text-[#2F9E44]">
                Chuyên gia
              </span>
            )}
          </div>
          <p className="mt-1 text-[14px] text-[#1B1B1B] leading-relaxed">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4 px-2 text-[13px] font-[500] text-[#5C5C5C]">
          <span>{formattedDate}</span>
          <button 
            onClick={handleUpvote}
            className={`transition-colors hover:text-[#2F9E44] ${vote === "up" ? "text-[#2F9E44]" : ""}`}
          >
            Thích ({comment.upvotes + (vote === "up" ? 1 : 0)})
          </button>
          {!isReply && (
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="transition-colors hover:text-[#2F9E44]"
            >
              Phản hồi
            </button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-3 flex gap-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Viết phản hồi cho ${comment.author.name}...`}
              className="flex-1 resize-none rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] p-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
              rows={1}
            />
            <button 
              disabled={!replyContent.trim()}
              className="rounded-lg bg-[#2F9E44] px-4 py-2 text-[14px] font-[600] text-white disabled:opacity-50"
            >
              Gửi
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-2 border-l-2 border-[#E0E0E0] pl-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
