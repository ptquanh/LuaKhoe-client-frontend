"use client";

import {
  useCreateComment,
  useDeleteComment,
  useVoteComment,
} from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";
import { ForumComment } from "@/types/forum.type";
import { Dropdown, message, Modal } from "antd";
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

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
  const { profile } = useProfile();

  const voteMutation = useVoteComment();
  const createCommentMutation = useCreateComment(comment.postId);
  const deleteCommentMutation = useDeleteComment(comment.postId);

  useEffect(() => {
    setVote(comment.userVote || null);
  }, [comment.userVote]);

  const handleUpvote = () => {
    const nextVote = vote === "up" ? "none" : "up";
    setVote(nextVote === "none" ? null : nextVote);
    voteMutation.mutate({
      commentId: comment.id,
      postId: comment.postId,
      type: nextVote,
    });
  };

  const handleDownvote = () => {
    const nextVote = vote === "down" ? "none" : "down";
    setVote(nextVote === "none" ? null : nextVote);
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

  if (initialUserVote === "up") {
    if (vote === null) {
      displayedUpvotes = Math.max(0, displayedUpvotes - 1);
    } else if (vote === "down") {
      displayedUpvotes = Math.max(0, displayedUpvotes - 1);
      displayedDownvotes += 1;
    }
  } else if (initialUserVote === "down") {
    if (vote === null) {
      displayedDownvotes = Math.max(0, displayedDownvotes - 1);
    } else if (vote === "up") {
      displayedDownvotes = Math.max(0, displayedDownvotes - 1);
      displayedUpvotes += 1;
    }
  } else {
    if (vote === "up") {
      displayedUpvotes += 1;
    } else if (vote === "down") {
      displayedDownvotes += 1;
    }
  }

  const handleReplySubmit = async () => {
    const trimmed = replyContent.trim();
    if (!trimmed) return;

    if (trimmed.length > 1000) {
      message.error("Phản hồi không được vượt quá 1000 ký tự!");
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        content: trimmed,
        parentId: comment.id,
      });
      message.success("Phản hồi thành công!");
      setReplyContent("");
      setShowReplyInput(false);
    } catch (err: any) {
      message.error(err.message || "Phản hồi thất bại.");
    }
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
        src={comment.author.avatarUrl}
        alt={comment.author.name}
        className={`${isReply ? "h-8 w-8" : "h-10 w-10"} shrink-0 rounded-full object-cover`}
      />

      {/* Content Area */}
      <div className="flex-1">
        <div className="group relative">
          <div className="rounded-2xl bg-[#F0F2F5] px-4 py-3 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-[600] text-[#1B1B1B] dark:text-gray-100">
                  {comment.author.name}
                </span>
                {comment.author.role === "expert" && (
                  <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-[500] text-[#2F9E44] dark:bg-green-950/40 dark:text-green-400">
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
                  <button className="rounded-full p-1 text-[#5C5C5C] opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </Dropdown>
              )}
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-[#1B1B1B] dark:text-gray-200">
              {comment.content}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4 px-2 text-[13px] font-[500] text-[#5C5C5C] dark:text-gray-400">
          <span>{formattedDate}</span>
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-0.5 transition-colors hover:text-[#2F9E44] dark:hover:text-green-400 ${vote === "up" ? "font-[600] text-[#2F9E44]" : ""}`}
          >
            <span>👍 Hữu ích</span>
            <span>({displayedUpvotes})</span>
          </button>

          <button
            onClick={handleDownvote}
            className={`flex items-center gap-0.5 transition-colors hover:text-[#E53935] dark:hover:text-red-400 ${vote === "down" ? "font-[600] text-[#E53935]" : ""}`}
          >
            <span>👎 Không hữu ích</span>
            <span>({displayedDownvotes})</span>
          </button>

          {!isReply && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="transition-colors hover:text-[#2F9E44] dark:hover:text-green-400"
            >
              Phản hồi
            </button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Viết phản hồi cho ${comment.author.name}...`}
                maxLength={1000}
                className="w-full resize-none rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] p-2 pb-6 text-[14px] focus:border-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                rows={1}
              />
              <span className="absolute right-2 bottom-1 text-[10px] font-medium text-[#9E9E9E] dark:text-gray-500">
                {replyContent.length}/1000
              </span>
            </div>
            <button
              onClick={handleReplySubmit}
              disabled={!replyContent.trim() || createCommentMutation.isPending}
              className="flex items-center gap-1 rounded-lg bg-[#2F9E44] px-4 py-2 text-[14px] font-[600] text-white hover:bg-[#1F6F2E] disabled:opacity-50"
            >
              {createCommentMutation.isPending && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              <span>Gửi</span>
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-2 border-l-2 border-[#E0E0E0] pl-4 dark:border-gray-800">
            {comment.replies.slice(0, visibleRepliesCount).map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}

            {/* Show More / Hide Buttons for Replies */}
            {comment.replies.length > 3 && (
              <div className="mt-3 flex items-center gap-4 pt-1">
                {comment.replies.length > visibleRepliesCount && (
                  <button
                    onClick={() => setVisibleRepliesCount((prev) => prev + 5)}
                    className="cursor-pointer text-[12px] font-[600] text-[#2F9E44] transition-colors hover:text-[#1F6F2E] hover:underline dark:text-green-400 dark:hover:text-green-300"
                  >
                    Hiển thị thêm phản hồi (
                    {comment.replies.length - visibleRepliesCount})
                  </button>
                )}
                {visibleRepliesCount > 3 && (
                  <button
                    onClick={() => setVisibleRepliesCount(3)}
                    className="cursor-pointer text-[12px] font-[500] text-[#5C5C5C] transition-colors hover:text-[#1B1B1B] hover:underline dark:text-gray-400 dark:hover:text-gray-200"
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
