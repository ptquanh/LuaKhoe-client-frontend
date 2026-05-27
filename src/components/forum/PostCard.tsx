"use client";

import { MessageSquare, MoreHorizontal, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { message } from "antd";
import { ForumPost } from "@/types/forum.type";
import CommentSection from "./CommentSection";
import { MOCK_COMMENTS } from "@/services/mock/forum.mock";

interface PostCardProps {
  post: ForumPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [showComments, setShowComments] = useState(false);

  // Lấy comments mock cho bài viết này
  const comments = MOCK_COMMENTS.filter((c) => c.postId === post.id);

  const handleUpvote = () => setVote(vote === "up" ? null : "up");
  const handleDownvote = () => setVote(vote === "down" ? null : "down");

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/forum/post/${post.id}`;
      await navigator.clipboard.writeText(url);
      message.success("Đã sao chép đường dẫn bài viết!");
    } catch (err) {
      message.error("Không thể sao chép đường dẫn.");
    }
  };

  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F4EA] text-[#2F9E44] font-semibold">
              {post.author.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-[600] text-[#1B1B1B]">{post.author.name}</span>
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
        <p className="text-[15px] leading-relaxed text-[#1B1B1B]">{post.content}</p>
        
        {post.images && post.images.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-lg border border-[#E0E0E0]">
            <img 
              src={post.images[0]} 
              alt="Post attachment" 
              className="w-full object-cover max-h-[400px]"
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-[#F0F2F5] px-2 py-1 text-[12px] text-[#5C5C5C]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-[#E0E0E0] pt-3">
        <div className="flex items-center gap-1 rounded-lg bg-[#F0F2F5] p-1">
          <button 
            onClick={handleUpvote}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[14px] font-[500] transition-colors hover:bg-[#E0E0E0] ${
              vote === "up" ? "text-[#2F9E44] bg-[#E6F4EA] hover:bg-[#E6F4EA]" : "text-[#5C5C5C]"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.upvotes + (vote === "up" ? 1 : 0)}</span>
          </button>
          <div className="h-4 w-px bg-[#D1D1D1]"></div>
          <button 
            onClick={handleDownvote}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[14px] font-[500] transition-colors hover:bg-[#E0E0E0] ${
              vote === "down" ? "text-[#E53935] bg-[#FFEbee] hover:bg-[#FFEbee]" : "text-[#5C5C5C]"
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
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
