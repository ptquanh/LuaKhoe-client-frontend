"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { message } from "antd";
import CommentItem from "./CommentItem";
import { useProfile } from "@/hooks/useProfile";
import { useForumComments, useCreateComment } from "@/hooks/useForum";

interface CommentSectionProps {
  postId: string;
  initialIsOpen?: boolean;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const { profile } = useProfile();

  // Load comments dynamically from server via React Query
  const { data: response, isLoading, isError } = useForumComments(postId);
  const createCommentMutation = useCreateComment(postId);

  const comments = response?.data?.items || [];

  const profileName = (() => {
    if (!profile) return "Thành viên";
    const subProfile = profile.farmerProfile || profile.adminProfile;
    const first = subProfile?.firstName || "";
    const last = subProfile?.lastName || "";
    return `${last} ${first}`.trim() || profile.username || "Thành viên";
  })();

  const avatarUrl = profile?.avatarUrl || "";

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    if (trimmed.length > 1000) {
      message.error("Bình luận không được vượt quá 1000 ký tự!");
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        content: trimmed,
      });
      message.success("Bình luận thành công!");
      setNewComment("");
    } catch (err: any) {
      message.error(err.message || "Bình luận thất bại.");
    }
  };

  const visibleComments = comments.slice(0, visibleCount);

  return (
    <div className="mt-6 rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm md:p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-6 text-[18px] font-[600] text-[#1B1B1B] dark:text-gray-100">
        Bình luận ({comments.length})
      </h3>

      {/* Comment Input */}
      <div className="mb-8 flex gap-3">
        <img
          src={avatarUrl}
          alt={profileName}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="flex flex-1 items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-[#E0E0E0] bg-[#F7F7F7] p-3 pb-8 text-[14px] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
              rows={2}
            />
            <span className="absolute right-3 bottom-2 text-[11px] font-medium text-[#9E9E9E] dark:text-gray-500">
              {newComment.length}/1000
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim() || createCommentMutation.isPending}
            className="flex shrink-0 items-center justify-center rounded-xl bg-[#2F9E44] p-3 text-white transition-colors hover:bg-[#1F6F2E] disabled:opacity-50"
          >
            {createCommentMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-[#2F9E44]" />
          </div>
        ) : isError ? (
          <p className="text-center text-[14px] text-red-500">
            Không thể tải danh sách bình luận.
          </p>
        ) : visibleComments.length > 0 ? (
          visibleComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="py-4 text-center text-[14px] text-[#5C5C5C] dark:text-gray-400">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!
          </p>
        )}
      </div>

      {/* Show More / Hide Buttons */}
      {comments.length > 3 && (
        <div className="mt-4 flex items-center gap-4 border-t border-[#F0F2F5] pt-3 dark:border-gray-800">
          {comments.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="cursor-pointer text-[14px] font-[600] text-[#2F9E44] transition-colors hover:text-[#1F6F2E] hover:underline dark:text-green-400 dark:hover:text-green-300"
            >
              Hiển thị thêm bình luận ({comments.length - visibleCount})
            </button>
          )}
          {visibleCount > 3 && (
            <button
              onClick={() => setVisibleCount(3)}
              className="cursor-pointer text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:text-[#1B1B1B] hover:underline dark:text-gray-400 dark:hover:text-gray-200"
            >
              Thu gọn
            </button>
          )}
        </div>
      )}
    </div>
  );
}
