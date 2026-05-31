"use client";

import { App, Button, Image, Spin } from "antd";
import { useMemo, useState } from "react";

import CreatePostWidget from "@/components/forum/CreatePostWidget";
import { useDeletePost, useForumPosts } from "@/hooks/useForum";
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
        <h2 className="text-[18px] font-[700] text-[#1B1B1B] dark:text-white">
          Dòng thời gian công khai
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSort("new")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${
              sort === "new"
                ? "bg-[#E6F4EA] text-[#2F9E44] dark:bg-emerald-950/30 dark:text-emerald-400"
                : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5] dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" /> Mới nhất
          </button>
          <button
            onClick={() => setSort("hot")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${
              sort === "hot"
                ? "bg-[#E6F4EA] text-[#2F9E44] dark:bg-emerald-950/30 dark:text-emerald-400"
                : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5] dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <Flame className="h-4 w-4" aria-hidden="true" /> Hot nhất
          </button>
        </div>
      </div>

      {/* Write announcement section */}
      <div className="rounded-xl border border-[#E0E0E0] bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 text-[15px] font-[700] text-[#1B1B1B] dark:text-white">
          📢 Đăng thông báo chính thức từ Ban quản trị
        </h3>
        <CreatePostWidget />
      </div>

      {/* Community public feed */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-[#E0E0E0] bg-white dark:border-gray-800 dark:bg-gray-900">
          <Spin size="large" description="Đang tải dòng thời gian…" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E0E0E0] bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <MessageSquare
            className="h-12 w-12 text-gray-300 dark:text-gray-700"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-[15px] font-semibold text-gray-900 dark:text-white">
            Chưa có bài đăng nào trên bảng tin
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`group relative overflow-hidden rounded-xl border bg-white p-5 transition-all dark:bg-gray-900 ${
                post.isAdminPost
                  ? "border-[#2F9E44]/40 bg-emerald-50/5 dark:border-emerald-800/40"
                  : "border-[#E0E0E0] dark:border-gray-800"
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
                      className="h-11 w-11 rounded-full border border-gray-100 object-cover dark:border-gray-800"
                    />
                    <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-extrabold text-white ring-2 ring-white">
                      {post.isAdminPost ? "📢" : "🌾"}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[15px] font-semibold text-gray-900 group-hover:text-[#2F9E44] dark:text-white">
                        {post.author?.name}
                      </h4>
                      {post.author?.role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <Shield className="h-3 w-3" aria-hidden="true" /> BQT
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2.5 text-[12px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {new Date(post.createdAt).toLocaleString("vi-VN")}
                      </span>
                      <span>•</span>
                      {post.category && (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <Tag className="h-3 w-3" aria-hidden="true" />
                          {post.category}
                        </span>
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
                  className="flex items-center justify-center text-rose-600 hover:bg-rose-50"
                  title="Xóa bài viết vi phạm"
                />
              </div>

              {/* Content */}
              <div className="mt-4 text-[14px] leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
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
                        className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800"
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
                className="flex items-center gap-1.5 rounded-xl border border-gray-300 px-6 py-2 text-[14px] font-semibold text-gray-700 hover:border-[#2F9E44] hover:text-[#2F9E44]"
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
