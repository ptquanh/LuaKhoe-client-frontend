"use client";

import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ACCESS_TOKEN } from "@/constants/auth";
import { useCreateComment, useForumComments } from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";

import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  initialIsOpen?: boolean;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleSubmit = (content: string, imageFile: File | null) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      createCommentMutation.mutate(formData, {
        onSuccess: () => resolve(),
        onError: (err) => reject(err),
      });
    });
  };

  const visibleComments = comments.slice(0, visibleCount);

  return (
    <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm md:p-6">
      <h3 className="mb-6 text-lg font-semibold text-[var(--text-primary)] tabular-nums">
        Bình luận ({comments.length})
      </h3>

      {/* Comment Input */}
      <div className="mb-8">
        {!mounted ? (
          <div className="h-20 w-full animate-pulse rounded-xl bg-[var(--bg-subtle)]" />
        ) : getCookie(ACCESS_TOKEN) ? (
          <CommentInput
            onSubmit={handleSubmit}
            avatarUrl={avatarUrl}
            profileName={profileName}
            isPending={createCommentMutation.isPending}
          />
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Vui lòng{" "}
              <Link
                href="/login"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                đăng nhập
              </Link>{" "}
              để bình luận về bài viết này.
            </p>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2
              className="h-6 w-6 animate-spin text-[var(--primary)]"
              aria-hidden="true"
            />
          </div>
        ) : isError ? (
          <p className="text-center text-sm text-red-500">
            Không thể tải danh sách bình luận.
          </p>
        ) : visibleComments.length > 0 ? (
          visibleComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="py-4 text-center text-sm text-[var(--text-secondary)]">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!
          </p>
        )}
      </div>

      {/* Show More / Hide Buttons */}
      {comments.length > 3 && (
        <div className="mt-4 flex items-center gap-4 border-t border-[var(--border)] pt-3">
          {comments.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="cursor-pointer text-sm font-semibold text-[var(--primary)] transition-colors hover:underline"
            >
              Hiển thị thêm bình luận ({comments.length - visibleCount})
            </button>
          )}
          {visibleCount > 3 && (
            <button
              onClick={() => setVisibleCount(3)}
              className="cursor-pointer text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:underline"
            >
              Thu gọn
            </button>
          )}
        </div>
      )}
    </div>
  );
}
