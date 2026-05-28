"use client";

import {
  MessageSquare,
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { ForumComment } from "@/types/forum.type";

interface CommentItemProps {
  comment: ForumComment;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  isReply = false,
}: CommentItemProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(
    comment.userVote || null,
  );
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [visibleRepliesCount, setVisibleRepliesCount] = useState(3);

  const handleUpvote = () => setVote(vote === "up" ? null : "up");
  const handleDownvote = () => setVote(vote === "down" ? null : "down");

  // Calculate displayed upvotes and downvotes optimistically
  const initialUserVote = comment.userVote || null;
  let displayedUpvotes = comment.upvotes;
  let displayedDownvotes = comment.downvotes;

  if (initialUserVote === "up") {
    if (vote === null) {
      displayedUpvotes -= 1;
    } else if (vote === "down") {
      displayedUpvotes -= 1;
      displayedDownvotes += 1;
    }
  } else if (initialUserVote === "down") {
    if (vote === null) {
      displayedDownvotes -= 1;
    } else if (vote === "up") {
      displayedDownvotes -= 1;
      displayedUpvotes += 1;
    }
  } else {
    if (vote === "up") {
      displayedUpvotes += 1;
    } else if (vote === "down") {
      displayedDownvotes += 1;
    }
  }

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(comment.createdAt));

  return (
    <div className={`flex gap-3 ${isReply ? "mt-4" : "mt-5"}`}>
      {/* Avatar */}
      {comment.author.avatarUrl ? (
        <img
          src={comment.author.avatarUrl}
          alt={comment.author.name}
          className={`${isReply ? "h-8 w-8" : "h-10 w-10"} shrink-0 rounded-full object-cover`}
        />
      ) : (
        <div
          className={`flex ${isReply ? "h-8 w-8 text-[12px]" : "h-10 w-10"} shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] font-semibold text-[#2F9E44]`}
        >
          {comment.author.name.charAt(0)}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1">
        <div className="rounded-2xl bg-[#F0F2F5] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-[600] text-[#1B1B1B]">
              {comment.author.name}
            </span>
            {comment.author.role === "expert" && (
              <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-[500] text-[#2F9E44]">
                Chuyên gia
              </span>
            )}
          </div>
          <p className="mt-1 text-[14px] leading-relaxed text-[#1B1B1B]">
            {comment.content}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4 px-2 text-[13px] font-[500] text-[#5C5C5C]">
          <span>{formattedDate}</span>
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-0.5 transition-colors hover:text-[#2F9E44] ${vote === "up" ? "font-[600] text-[#2F9E44]" : ""}`}
          >
            <span>👍 Hữu ích</span>
            <span>({displayedUpvotes})</span>
          </button>

          <button
            onClick={handleDownvote}
            className={`flex items-center gap-0.5 transition-colors hover:text-[#E53935] ${vote === "down" ? "font-[600] text-[#E53935]" : ""}`}
          >
            <span>👎 Không hữu ích</span>
            <span>({displayedDownvotes})</span>
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
            {comment.replies.slice(0, visibleRepliesCount).map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}

            {/* Show More / Hide Buttons for Replies */}
            {comment.replies.length > 3 && (
              <div className="mt-3 flex items-center gap-4 pt-1">
                {comment.replies.length > visibleRepliesCount && (
                  <button
                    onClick={() => setVisibleRepliesCount((prev) => prev + 5)}
                    className="cursor-pointer text-[12px] font-[600] text-[#2F9E44] transition-colors hover:text-[#1F6F2E] hover:underline"
                  >
                    Hiển thị thêm phản hồi (
                    {comment.replies.length - visibleRepliesCount})
                  </button>
                )}
                {visibleRepliesCount > 3 && (
                  <button
                    onClick={() => setVisibleRepliesCount(3)}
                    className="cursor-pointer text-[12px] font-[500] text-[#5C5C5C] transition-colors hover:text-[#1B1B1B] hover:underline"
                  >
                    Thu gọn
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
