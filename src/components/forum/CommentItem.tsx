"use client";

import { Dropdown, Image, message, Modal } from "antd";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  useCreateComment,
  useDeleteComment,
  useVoteComment,
} from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";
import { ForumComment } from "@/types/forum.type";

import CommentInput from "./CommentInput";

interface CommentItemProps {
  comment: ForumComment;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  isReply = false,
}: CommentItemProps) {
  const [vote, setVote] = useState<"UP" | "DOWN" | null>(
    comment.userVote || null,
  );
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [visibleRepliesCount, setVisibleRepliesCount] = useState(3);
  const { profile } = useProfile();

  const voteMutation = useVoteComment();
  const createCommentMutation = useCreateComment(comment.postId);
  const deleteCommentMutation = useDeleteComment(comment.postId);

  useEffect(() => {
    setVote(comment.userVote || null);
  }, [comment.userVote]);

  const handleUpvote = () => {
    const nextVote = vote === "UP" ? "NONE" : "UP";
    setVote(nextVote === "NONE" ? null : nextVote);
    voteMutation.mutate({
      commentId: comment.id,
      postId: comment.postId,
      type: nextVote,
    });
  };

  const handleDownvote = () => {
    const nextVote = vote === "DOWN" ? "NONE" : "DOWN";
    setVote(nextVote === "NONE" ? null : nextVote);
    voteMutation.mutate({
      commentId: comment.id,
      postId: comment.postId,
      type: nextVote,
    });
  };

  // Calculate displayed upvotes and downvotes optimistically
  const initialUserVote = comment.userVote || null;
  let displayedUpvotes = comment.upvotes;
  let displayedDownvotes = comment.downvotes;

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

  const handleReplySubmit = (content: string, imageFile: File | null) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("parentId", comment.id);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      createCommentMutation.mutate(formData, {
        onSuccess: () => {
          setShowReplyInput(false);
          resolve();
        },
        onError: (err) => reject(err),
      });
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa bình luận",
      content:
        "Bạn có chắc chắn muốn xóa bình luận này không? Thao tác này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteCommentMutation.mutateAsync(comment.id);
          message.success("Đã xóa bình luận thành công.");
        } catch (err: any) {
          message.error(err.message || "Xóa bình luận thất bại.");
        }
      },
    });
  };

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(comment.createdAt));

  const isAuthor = profile?.id === comment.author.id;
  const isAdmin = profile?.role === "ADMIN";
  const canDelete = isAuthor || isAdmin;

  const dropdownItems = [
    {
      key: "delete",
      label: (
        <span className="flex items-center gap-2 text-red-600">
          <Trash2 className="h-4 w-4" />
          Xóa bình luận
        </span>
      ),
      onClick: handleDelete,
    },
  ];

  return (
    <div className={`flex gap-3 ${isReply ? "mt-4" : "mt-5"}`}>
      {/* Avatar */}
      <img
        src={
          comment.author.avatarUrl ||
          "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
        }
        alt={comment.author.name}
        className={`${isReply ? "h-8 w-8" : "h-10 w-10"} shrink-0 rounded-full object-cover`}
      />

      {/* Content Area */}
      <div className="min-w-0 flex-1">
        <div className="group relative">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {comment.author.name}
                </span>
                {comment.author.role === "EXPERT" && (
                  <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--primary)]">
                    Chuyên gia
                  </span>
                )}
              </div>

              {canDelete && (
                <Dropdown
                  menu={{ items: dropdownItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <button
                    type="button"
                    aria-label="Thêm tùy chọn"
                    className="rounded-full p-1 text-[var(--text-secondary)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--bg-hover)]"
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>
                </Dropdown>
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed break-words text-[var(--text-primary)]">
              {comment.content}
            </p>
            {comment.imageUrl && (
              <div className="relative mt-2 inline-block max-h-[200px] w-auto overflow-hidden rounded-lg">
                <Image
                  src={comment.imageUrl || undefined}
                  alt="Comment attachment"
                  className="rounded-lg object-contain"
                  style={{ maxHeight: "200px", maxWidth: "100%" }}
                  preview={{ mask: "Phóng to" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-wrap items-center gap-4 px-2 text-[13px] font-medium text-[var(--text-secondary)]">
          <span className="tabular-nums">{formattedDate}</span>
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 tabular-nums transition-colors hover:text-[var(--primary)] ${vote === "UP" ? "font-semibold text-[var(--primary)]" : ""}`}
          >
            <span>Hữu ích</span>
            <span>({displayedUpvotes})</span>
          </button>

          <button
            onClick={handleDownvote}
            className={`flex items-center gap-1 tabular-nums transition-colors hover:text-red-500 ${vote === "DOWN" ? "font-semibold text-red-600 dark:text-red-400" : ""}`}
          >
            <span>Không hữu ích</span>
            <span>({displayedDownvotes})</span>
          </button>

          {!isReply && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="transition-colors hover:text-[var(--primary)]"
            >
              Phản hồi
            </button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-3">
            <CommentInput
              placeholder={`Viết phản hồi cho ${comment.author.name}…`}
              isPending={createCommentMutation.isPending}
              onSubmit={handleReplySubmit}
            />
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-2 border-l-2 border-[var(--border)] pl-4">
            {comment.replies.slice(0, visibleRepliesCount).map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}

            {/* Show More / Hide Buttons for Replies */}
            {comment.replies.length > 3 && (
              <div className="mt-3 flex items-center gap-4 pt-1">
                {comment.replies.length > visibleRepliesCount && (
                  <button
                    onClick={() => setVisibleRepliesCount((prev) => prev + 5)}
                    className="cursor-pointer text-xs font-semibold text-[var(--primary)] transition-colors hover:underline"
                  >
                    Hiển thị thêm phản hồi (
                    {comment.replies.length - visibleRepliesCount})
                  </button>
                )}
                {visibleRepliesCount > 3 && (
                  <button
                    onClick={() => setVisibleRepliesCount(3)}
                    className="cursor-pointer text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:underline"
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
