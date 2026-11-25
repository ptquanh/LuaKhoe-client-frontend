"use client";

import { App, Button, Image, Spin } from "antd";
import {
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  MessageSquare,
  Shield,
  Tag,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import CreatePostWidget from "@/components/forum/CreatePostWidget";
import { useDeletePost, useForumPosts } from "@/hooks/useForum";

export default function AdminForumFeed() {
  const { message, modal } = App.useApp();
  const [sort, setSort] = useState<"hot" | "new">("new");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useForumPosts({
      sort,
      limit: 10,
    });

  const deletePostMutation = useDeletePost();

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.items || []) || [];
  }, [data]);

  const handleDeletePost = (id: string) => {
    modal.confirm({
      title: "Xóa bài viết",
      content:
        "Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này không? Hành động này không thể hoàn tác.",
      okText: "Xóa ngay",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePostMutation.mutateAsync(id);
          message.success("Xóa bài viết thành công!");
        } catch (err: any) {
          message.error(err.message || "Có lỗi xảy ra khi xóa bài viết.");
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Announcements & Sorting Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          Dòng thời gian công khai
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSort("new")}
            className={`flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              sort === "new"
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" /> Mới nhất
          </button>
          <button
            onClick={() => setSort("hot")}
            className={`flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              sort === "hot"
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <Flame className="h-4 w-4" aria-hidden="true" /> Hot nhất
          </button>
        </div>
      </div>

      {/* Write announcement section */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <h3 className="mb-3 text-[15px] font-bold text-[var(--text-primary)]">
          Đăng thông báo chính thức từ Ban quản trị
        </h3>
        <CreatePostWidget />
      </div>

      {/* Community public feed */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          <Spin size="large" description="Đang tải dòng thời gian…" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] py-16">
          <MessageSquare
            className="h-12 w-12 text-[var(--text-muted)]"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-[15px] font-semibold text-[var(--text-primary)]">
            Chưa có bài đăng nào trên bảng tin
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-colors ${
                post.isAdminPost
                  ? "border-[var(--primary-border)] bg-[var(--primary-soft)]/25"
                  : "border-[var(--border)] bg-[var(--bg-card)]"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="relative">
                    <img
                      src={
                        post.author?.avatarUrl && post.author.avatarUrl !== ""
                          ? post.author.avatarUrl
                          : "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
                      }
                      alt={post.author?.name}
                      className="h-11 w-11 rounded-full border border-[var(--border)] object-cover"
                    />
                    <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[9px] font-extrabold text-white ring-2 ring-[var(--bg-card)]">
                      {post.isAdminPost ? "B" : "L"}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[15px] font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                        {post.author?.name}
                      </h4>
                      {post.author?.role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 rounded bg-[var(--primary-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--primary)]">
                          <Shield className="h-3 w-3" aria-hidden="true" /> BQT
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2.5 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 tabular-nums">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {new Date(post.createdAt).toLocaleString("vi-VN")}
                      </span>
                      {post.category && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-[var(--primary)]">
                            <Tag className="h-3 w-3" aria-hidden="true" />
                            {post.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  danger
                  type="text"
                  icon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
                  onClick={() => handleDeletePost(post.id)}
                  aria-label="Xóa bài viết vi phạm"
                  className="flex items-center justify-center text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  title="Xóa bài viết vi phạm"
                />
              </div>

              {/* Content */}
              <div className="mt-4 text-sm leading-relaxed break-words whitespace-pre-wrap text-[var(--text-primary)]">
                {post.content}
              </div>

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <Image.PreviewGroup>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {post.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => e.stopPropagation()}
                        className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)]"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Attachment-${idx}`}
                          className="object-cover"
                          style={{ width: "100%", height: "100%" }}
                          preview={{ mask: "Phóng to" }}
                        />
                      </div>
                    ))}
                  </div>
                </Image.PreviewGroup>
              )}
            </div>
          ))}

          {/* Pagination */}
          {hasNextPage && (
            <div className="mt-6 flex justify-center pb-4">
              <Button
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                className="flex min-h-11 items-center gap-1.5 rounded-xl border border-[var(--border)] px-6 py-2 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <span>Xem thêm bài viết</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
