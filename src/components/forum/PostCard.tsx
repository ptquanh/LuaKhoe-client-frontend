"use client";

import { useDeletePost, useVotePost } from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";
import { ForumPost } from "@/types/forum.type";
import { Dropdown, message, Modal } from "antd";
import { MessageSquare, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommentSection from "./CommentSection";
import DiagnosisEmbeddedCard from "./DiagnosisEmbeddedCard";

interface PostCardProps {
  post: ForumPost;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [vote, setVote] = useState<"UP" | "DOWN" | null>(post.userVote || null);
  const [showComments, setShowComments] = useState(false);
  const { profile } = useProfile();

  const renderContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(/((?:^|\s)@[a-zA-Z0-9_.]+)/g);
    return parts.map((part, index) => {
      if (part.trim().startsWith("@")) {
        const username = part.trim().slice(1);
        const prefix = part.slice(0, part.indexOf("@")); // Lấy khoảng trắng nếu có
        return (
          <span key={index}>
            {prefix}
            <Link
              href={`/profile/${username}`}
              className="font-semibold text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              @{username}
            </Link>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const voteMutation = useVotePost();
  const deletePostMutation = useDeletePost();

  useEffect(() => {
    setVote(post.userVote || null);
  }, [post.userVote]);

  const handleUpvote = () => {
    const nextVote = vote === "UP" ? "NONE" : "UP";
    setVote(nextVote === "NONE" ? null : nextVote);
    voteMutation.mutate({ postId: post.id, type: nextVote });
  };

  const handleDownvote = () => {
    const nextVote = vote === "DOWN" ? "NONE" : "DOWN";
    setVote(nextVote === "NONE" ? null : nextVote);
    voteMutation.mutate({ postId: post.id, type: nextVote });
  };

  // Calculate displayed upvotes and downvotes optimistically
  const initialUserVote = post.userVote || null;
  let displayedUpvotes = post.upvotes;
  let displayedDownvotes = post.downvotes;

  if (initialUserVote === "UP") {
    if (vote === null) {
      displayedUpvotes = Math.max(0, displayedUpvotes - 1);
    } else if (vote === "DOWN") {
      displayedUpvotes = Math.max(0, displayedUpvotes - 1);
      displayedDownvotes += 1;
    }
  } else if (initialUserVote === "DOWN") {
    if (vote === null) {
      displayedDownvotes = Math.max(0, displayedDownvotes - 1);
    } else if (vote === "UP") {
      displayedDownvotes = Math.max(0, displayedDownvotes - 1);
      displayedUpvotes += 1;
    }
  } else {
    if (vote === "UP") {
      displayedUpvotes += 1;
    } else if (vote === "DOWN") {
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

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa bài viết",
      content:
        "Bạn có chắc chắn muốn xóa bài viết này không? Thao tác này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePostMutation.mutateAsync(post.id);
          message.success("Đã xóa bài viết thành công.");
        } catch (err: any) {
          message.error(err.message || "Xóa bài viết thất bại.");
        }
      },
    });
  };

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(post.createdAt));

  const isAuthor = profile?.id === post.author.id;
  const isAdmin = profile?.role === "ADMIN";
  const canDelete = isAuthor || isAdmin;

  // Dropdown menu items for more options
  const dropdownItems = [
    {
      key: "delete",
      label: (
        <span className="flex items-center gap-2 text-red-600">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Xóa bài viết
        </span>
      ),
      onClick: handleDelete,
    },
  ];

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md ${
        post.isAdminPost
          ? "border-emerald-500 bg-emerald-50/10 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:shadow-[0_0_16px_rgba(16,185,129,0.25)] dark:border-emerald-500 dark:bg-emerald-950/10"
          : "border-[#E0E0E0] bg-white dark:border-gray-800 dark:bg-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl}
            alt={post.author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-[600] text-[#1B1B1B] dark:text-gray-100">
                {post.author.name}
              </span>
              {post.author.role === "expert" && (
                <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[12px] font-[500] text-[#2F9E44] dark:bg-green-950/40 dark:text-green-400">
                  Chuyên gia
                </span>
              )}
              {post.isAdminPost && (
                <span className="shrink-0 animate-pulse rounded bg-[#2F9E44] px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  📢 Thông báo BQT
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#757575] dark:text-gray-400">
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

        {canDelete && (
          <Dropdown
            menu={{ items: dropdownItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              aria-label="Thêm tùy chọn"
              className="rounded-lg p-2 text-[#5C5C5C] hover:bg-[#F0F2F5] dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dropdown>
        )}
      </div>

      {/* Content */}
      <div className="mt-3">
        <div
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (
              target.tagName !== "A" &&
              !target.closest("a") &&
              !target.closest("button")
            ) {
              router.push(`/forum/post/${post.id}`);
            }
          }}
          className="cursor-pointer text-[15px] leading-relaxed text-[#1B1B1B] hover:text-[#1F6F2E] dark:text-gray-300 dark:hover:text-emerald-400"
        >
          <p>{renderContent(post.content)}</p>
        </div>

        {post.images && post.images.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-lg border border-[#E0E0E0] dark:border-gray-800">
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
                className="rounded-md bg-[#F0F2F5] px-2 py-1 text-[12px] text-[#5C5C5C] dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.diagnosis && <DiagnosisEmbeddedCard diagnosis={post.diagnosis} />}

        {/* Top Community Solution Highlight (Sneak Peek) */}
        {post.topComment && (
          <div className="mt-4 rounded-xl border border-[#D3F9D8] bg-[#E6F4EA]/40 p-4 transition-all duration-200 hover:bg-[#E6F4EA]/60 dark:border-green-900/40 dark:bg-green-950/20 dark:hover:bg-green-950/30">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2F9E44] px-2.5 py-1 text-[11px] font-[600] text-white dark:bg-green-700">
                ✨ Giải pháp được cộng đồng đánh giá cao nhất
              </span>
              <span className="text-[12px] font-[600] text-[#2F9E44] dark:text-green-400">
                Điểm đánh giá:{" "}
                {post.topComment.upvotes - post.topComment.downvotes}
              </span>
            </div>

            <div className="flex gap-3">
              <img
                src={post.topComment.author.avatarUrl}
                alt={post.topComment.author.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-[600] text-[#1B1B1B] dark:text-gray-200">
                    {post.topComment.author.name}
                  </span>
                  {post.topComment.author.role === "expert" && (
                    <span className="rounded-full bg-[#2F9E44]/10 px-2 py-0.5 text-[11px] font-[500] text-[#2F9E44] dark:bg-green-950/40 dark:text-green-400">
                      Chuyên gia
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#333333] dark:text-gray-400">
                  {post.topComment.content}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-[#E0E0E0] pt-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-[600] transition-all duration-200 ${
              vote === "UP"
                ? "border-[#2F9E44] bg-[#2F9E44] text-white shadow-sm hover:bg-[#1F6F2E]"
                : "border-[#E0E0E0] bg-white text-[#5C5C5C] hover:border-[#CCCCCC] hover:bg-[#F7F7F7] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>👍 Hữu ích</span>
            <span>({displayedUpvotes})</span>
          </button>

          {/* Downvote Button */}
          <button
            onClick={handleDownvote}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-[600] transition-all duration-200 ${
              vote === "DOWN"
                ? "border-[#FCA5A5] bg-[#FEE2E2] text-[#991B1B] shadow-sm hover:bg-[#FECACA] dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                : "border-[#E0E0E0] bg-white text-[#5C5C5C] hover:border-[#CCCCCC] hover:bg-[#F7F7F7] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>👎 Không hữu ích</span>
            <span>({displayedDownvotes})</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5] dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            <span>{post.commentCount} Bình luận</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5] dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Inline Comments */}
      {showComments && (
        <div className="mt-4 border-t border-[#E0E0E0] pt-4 dark:border-gray-800">
          <CommentSection postId={post.id} initialIsOpen={true} />
        </div>
      )}
    </div>
  );
}
