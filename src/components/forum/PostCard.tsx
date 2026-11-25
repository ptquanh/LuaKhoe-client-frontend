"use client";

import { Dropdown, Image, message, Modal } from "antd";
import { MessageSquare, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useDeletePost, useVotePost } from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";
import { ForumPost } from "@/types/forum.type";

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
      className={`rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
        post.isAdminPost
          ? "border-[var(--primary)]/50 bg-[var(--primary-soft)]/20"
          : "border-[var(--border)] bg-[var(--bg-card)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={
              post.author.avatarUrl ||
              "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
            }
            alt={post.author.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-semibold text-[var(--text-primary)]">
                {post.author.name}
              </span>
              {post.author.role === "EXPERT" && (
                <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                  Chuyên gia
                </span>
              )}
              {post.isAdminPost && (
                <span className="shrink-0 rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  Thông báo BQT
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
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
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
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
          className="cursor-pointer text-[15px] leading-relaxed break-words text-[var(--text-primary)] transition-colors hover:text-[var(--primary)]"
        >
          <p>{renderContent(post.content)}</p>
        </div>

        {post.images && post.images.length > 0 && (
          <Image.PreviewGroup>
            <div className="relative mt-3 max-h-[400px] w-full overflow-hidden rounded-xl border border-[var(--border)]">
              <Image
                src={post.images[0] || undefined}
                alt="Post attachment"
                className="object-cover"
                style={{ width: "100%", height: "100%", maxHeight: "400px" }}
                preview={{ mask: "Thu phóng" }}
              />
            </div>
          </Image.PreviewGroup>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--bg-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.diagnosis && <DiagnosisEmbeddedCard diagnosis={post.diagnosis} />}

        {/* Top Community Solution Highlight (Sneak Peek) */}
        {post.topComment && (
          <div className="mt-4 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary-soft)]/50 p-4 transition-colors duration-200 hover:bg-[var(--primary-soft)]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)] px-2.5 py-1 text-[11px] font-semibold text-white">
                Giải pháp được cộng đồng đánh giá cao nhất
              </span>
              <span className="text-xs font-semibold text-[var(--primary)] tabular-nums">
                Điểm đánh giá:{" "}
                {post.topComment.upvotes - post.topComment.downvotes}
              </span>
            </div>

            <div className="flex gap-3">
              <img
                src={
                  post.topComment.author.avatarUrl ||
                  "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
                }
                alt={post.topComment.author.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                    {post.topComment.author.name}
                  </span>
                  {post.topComment.author.role === "EXPERT" && (
                    <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--primary)]">
                      Chuyên gia
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed break-words text-[var(--text-secondary)]">
                  {post.topComment.content}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold tabular-nums transition-colors duration-200 ${
              vote === "UP"
                ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-hover)]"
                : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <span>Hữu ích</span>
            <span>({displayedUpvotes})</span>
          </button>

          {/* Downvote Button */}
          <button
            onClick={handleDownvote}
            className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold tabular-nums transition-colors duration-200 ${
              vote === "DOWN"
                ? "border-red-300 bg-red-50 text-red-700 shadow-sm hover:bg-red-100 dark:border-red-800/70 dark:bg-red-950/50 dark:text-red-300"
                : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <span>Không hữu ích</span>
            <span>({displayedDownvotes})</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            <span className="tabular-nums">{post.commentCount} Bình luận</span>
          </button>
          <button
            onClick={handleShare}
            className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Inline Comments */}
      {showComments && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <CommentSection postId={post.id} initialIsOpen={true} />
        </div>
      )}
    </div>
  );
}
