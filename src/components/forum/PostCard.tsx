"use client";

import {
  MessageSquare,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { message } from "antd";
import { ForumPost } from "@/types/forum.type";
import CommentSection from "./CommentSection";
import { MOCK_COMMENTS } from "@/services/mock/forum.mock";

interface PostCardProps {
  post: ForumPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(post.userVote || null);
  const [showComments, setShowComments] = useState(false);

  // Lấy comments mock cho bài viết này
  const comments = MOCK_COMMENTS.filter((c) => c.postId === post.id);

  const handleUpvote = () => setVote(vote === "up" ? null : "up");
  const handleDownvote = () => setVote(vote === "down" ? null : "down");

  // Calculate displayed upvotes and downvotes optimistically
  const initialUserVote = post.userVote || null;
  let displayedUpvotes = post.upvotes;
  let displayedDownvotes = post.downvotes;

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

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/forum/post/${post.id}`;
      await navigator.clipboard.writeText(url);
      message.success("Đã sao chép đường dẫn bài viết!");
    } catch (err) {
      message.error("Không thể sao chép đường dẫn.");
    }
  };

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(post.createdAt));

  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F4EA] font-semibold text-[#2F9E44]">
              {post.author.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-[600] text-[#1B1B1B]">
                {post.author.name}
              </span>
              {post.author.role === "expert" && (
                <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[12px] font-[500] text-[#2F9E44]">
                  Chuyên gia
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#757575]">
              <span>{formattedDate}</span>
              {post.author.location && (
                <>
                  <span>•</span>
                  <span>{post.author.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="rounded-lg p-2 text-[#5C5C5C] hover:bg-[#F0F2F5]">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-3">
        <p className="text-[15px] leading-relaxed text-[#1B1B1B]">
          {post.content}
        </p>

        {post.images && post.images.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-lg border border-[#E0E0E0]">
            <img
              src={post.images[0]}
              alt="Post attachment"
              className="max-h-[400px] w-full object-cover"
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[#F0F2F5] px-2 py-1 text-[12px] text-[#5C5C5C]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Top Community Solution Highlight (Sneak Peek) */}
        {post.topComment && (
          <div className="mt-4 rounded-xl border border-[#D3F9D8] bg-[#E6F4EA]/40 p-4 transition-all duration-200 hover:bg-[#E6F4EA]/60">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2F9E44] px-2.5 py-1 text-[11px] font-[600] text-white">
                ✨ Giải pháp được cộng đồng đánh giá cao nhất
              </span>
              <span className="text-[12px] font-[600] text-[#2F9E44]">
                Điểm đánh giá:{" "}
                {post.topComment.upvotes - post.topComment.downvotes}
              </span>
            </div>

            <div className="flex gap-3">
              {post.topComment.author.avatarUrl ? (
                <img
                  src={post.topComment.author.avatarUrl}
                  alt={post.topComment.author.name}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D3F9D8] text-[11px] font-semibold text-[#2F9E44]">
                  {post.topComment.author.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-[600] text-[#1B1B1B]">
                    {post.topComment.author.name}
                  </span>
                  {post.topComment.author.role === "expert" && (
                    <span className="rounded-full bg-[#2F9E44]/10 px-2 py-0.5 text-[11px] font-[500] text-[#2F9E44]">
                      Chuyên gia
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#333333]">
                  {post.topComment.content}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-[#E0E0E0] pt-3">
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-[600] transition-all duration-200 ${
              vote === "up"
                ? "border-[#2F9E44] bg-[#2F9E44] text-white shadow-sm hover:bg-[#1F6F2E]"
                : "border-[#E0E0E0] bg-white text-[#5C5C5C] hover:border-[#CCCCCC] hover:bg-[#F7F7F7]"
            }`}
          >
            <span>👍 Hữu ích</span>
            <span>({displayedUpvotes})</span>
          </button>

          {/* Downvote Button */}
          <button
            onClick={handleDownvote}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-[600] transition-all duration-200 ${
              vote === "down"
                ? "border-[#FCA5A5] bg-[#FEE2E2] text-[#991B1B] shadow-sm hover:bg-[#FECACA]"
                : "border-[#E0E0E0] bg-white text-[#5C5C5C] hover:border-[#CCCCCC] hover:bg-[#F7F7F7]"
            }`}
          >
            <span>👎 Không hữu ích</span>
            <span>({displayedDownvotes})</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentCount} Bình luận</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5]"
          >
            <Share2 className="h-4 w-4" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Inline Comments */}
      {showComments && (
        <div className="mt-4 border-t border-[#E0E0E0] pt-4">
          <CommentSection comments={comments} />
        </div>
      )}
    </div>
  );
}
