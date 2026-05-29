"use client";

import PostStatusBadge from "@/components/forum/PostStatusBadge";
import { useDeletePost, useMyPosts } from "@/hooks/useForum";
import { forumService } from "@/services/forum.service";
import { ForumPost } from "@/types/forum.type";
import { Button, Input, message, Modal, Select, Spin, Tabs } from "antd";
import {
  AlertTriangle,
  Calendar,
  Edit,
  Globe,
  History,
  MessageSquare,
  Search,
  Send,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const { TextArea } = Input;

type StatusTab = "ALL" | "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Edit / Publish Draft Modal
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("Hỏi đáp");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch farmer's own posts with status and search
  const statusParam = activeTab === "ALL" ? undefined : activeTab;
  const {
    data: res,
    isLoading,
    refetch,
  } = useMyPosts({
    status: statusParam,
    search: debouncedSearch.trim() || undefined,
  });

  const posts = res?.data || [];

  const deletePostMutation = useDeletePost();

  const handleDeletePost = (id: string) => {
    Modal.confirm({
      title: "Xóa bài viết",
      content: "Bạn có chắc chắn muốn xóa bài viết này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePostMutation.mutateAsync(id);
          message.success("Xóa bài viết thành công!");
          refetch();
        } catch (err: any) {
          message.error(err.message || "Không thể xóa bài viết.");
        }
      },
    });
  };

  const handleEditClick = (post: ForumPost) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditCategory(post.category || "Hỏi đáp");
    setEditTags(post.tags || []);
    setTagInput("");
  };

  const handleSaveDraftOnly = async () => {
    if (!editingPost) return;
    if (!editContent.trim()) {
      message.error("Nội dung bài viết không được để trống!");
      return;
    }

    setIsSaving(true);
    try {
      await forumService.updatePost(editingPost.id, {
        content: editContent.trim(),
        category: editCategory,
        tags: editTags,
      });
      message.success("Đã lưu bản nháp thành công!");
      setEditingPost(null);
      refetch();
    } catch (err: any) {
      message.error(err.message || "Lỗi khi lưu bản nháp.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishDraft = async () => {
    if (!editingPost) return;
    if (!editContent.trim()) {
      message.error("Nội dung bài viết không được để trống!");
      return;
    }

    setIsSaving(true);
    try {
      // Transition from DRAFT to PENDING / APPROVED by passing isDraft: false
      const result = await forumService.updatePost(editingPost.id, {
        content: editContent.trim(),
        category: editCategory,
        tags: editTags,
        // Trigger server-side Regex & LLM validation
        ...({ isDraft: false } as any),
      });

      if (result.data?.status === "REJECTED") {
        message.warning(
          `Bài đăng bị từ chối tự động: ${result.data.flaggedReason}`,
        );
      } else {
        message.success(
          "Đã gửi đăng bài viết thành công! Đang chờ kiểm duyệt.",
        );
      }

      setEditingPost(null);
      refetch();
    } catch (err: any) {
      message.error(err.message || "Lỗi khi đăng bài viết.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/#/g, "");
      if (newTag && !editTags.includes(newTag)) {
        setEditTags([...editTags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="mx-auto max-w-[800px] flex-col gap-6 pt-6 pb-20">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-[24px] font-[700] text-[#1B1B1B] dark:text-gray-100">
            Bài viết của tôi
          </h1>
          <p className="text-[14px] text-[#5C5C5C] dark:text-gray-400">
            Xem lịch sử đăng bài, quản lý bản nháp và theo dõi trạng thái kiểm
            duyệt bài viết.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full shrink-0 md:w-[250px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E9E9E]">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết…"
            aria-label="Tìm kiếm bài viết của tôi"
            className="w-full rounded-full border border-[#E0E0E0] bg-white py-2 pr-4 pl-9 text-[13px] text-[#1B1B1B] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Segmented Control Navigation */}
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        <Link
          href="/forum"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-center font-medium text-gray-600 transition hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-gray-400 dark:hover:text-green-400"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span>Diễn đàn chung</span>
        </Link>
        <Link
          href="/forum/my-posts"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-center font-bold text-[#2F9E44] shadow-xs focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:bg-gray-700 dark:text-green-400"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          <span>Bài viết của tôi</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as StatusTab)}
          className="custom-tabs"
          items={[
            { key: "ALL", label: "Tất cả" },
            { key: "DRAFT", label: "Bản nháp" },
            { key: "PENDING", label: "Chờ duyệt" },
            { key: "APPROVED", label: "Đã đăng" },
            { key: "REJECTED", label: "Bị từ chối" },
          ]}
        />
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spin size="large" tip="Đang tải bài viết…" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E0E0E0] bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
          <MessageSquare
            className="h-10 w-10 text-gray-300 dark:text-gray-700"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-[15px] font-semibold text-gray-900 dark:text-white">
            Không tìm thấy bài viết nào
          </h3>
          <p className="mt-1 text-[13px] text-[#5C5C5C]">
            Bà con chưa có bài viết nào thuộc mục này.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group overflow-hidden rounded-xl border border-[#E0E0E0] bg-white p-5 transition-all hover:border-[#2F9E44]/30 dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-2.5 text-[12px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span>•</span>
                  {post.category && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Tag className="h-3 w-3" aria-hidden="true" />
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <PostStatusBadge status={post.status} />
                  {post.status === "REJECTED" && post.flaggedReason && (
                    <span
                      className="max-w-[220px] truncate text-right text-[12px] font-medium text-red-600 dark:text-red-400"
                      title={post.flaggedReason}
                    >
                      Lý do: {post.flaggedReason}
                    </span>
                  )}
                </div>
              </div>

              {/* Content body */}
              <p className="mt-3 text-[14px] leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-block rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Attached images */}
              {post.images && post.images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {post.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video overflow-hidden rounded-lg border"
                    >
                      <img
                        src={imgUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Reject reason overlay */}
              {post.status === "REJECTED" && post.flaggedReason && (
                <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-rose-100/50 bg-rose-50/50 p-3 text-[12px] text-rose-800">
                  <AlertTriangle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-bold">Lý do từ chối:</span>{" "}
                    {post.flaggedReason}
                  </div>
                </div>
              )}

              {/* Footer controls */}
              <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-dashed border-gray-100 pt-3 dark:border-gray-800">
                {post.status === "DRAFT" && (
                  <button
                    type="button"
                    onClick={() => handleEditClick(post)}
                    className="flex items-center gap-1 rounded-lg bg-[#E6F4EA] px-3 py-1.5 text-[12px] font-bold text-[#2F9E44] transition hover:bg-[#D4EDDA] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none"
                  >
                    <Edit className="h-3.5 w-3.5" aria-hidden="true" /> Chỉnh
                    sửa & Đăng bài
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeletePost(post.id)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-bold text-rose-600 transition hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 focus-visible:outline-none"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Xóa bài
                  viết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Draft Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-[#2F9E44]">
            <Edit className="h-5 w-5" aria-hidden="true" />
            <span className="text-[16px] font-bold">
              Chỉnh sửa bản nháp bài viết
            </span>
          </div>
        }
        open={!!editingPost}
        onCancel={() => setEditingPost(null)}
        footer={[
          <Button key="cancel" onClick={() => setEditingPost(null)}>
            Hủy
          </Button>,
          <Button
            key="save"
            loading={isSaving}
            onClick={handleSaveDraftOnly}
            className="border-[#2F9E44] text-[#2F9E44] hover:text-[#1F6F2E]"
          >
            Lưu bản nháp
          </Button>,
          <Button
            key="publish"
            type="primary"
            loading={isSaving}
            onClick={handlePublishDraft}
            className="bg-[#2F9E44] hover:bg-[#1F6F2E]"
            icon={<Send className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Đăng công khai
          </Button>,
        ]}
        destroyOnClose
        width={600}
      >
        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="edit-category-select"
                className="mb-1.5 block text-[13px] font-[600] text-gray-700"
              >
                Thể loại bài đăng
              </label>
              <Select
                id="edit-category-select"
                value={editCategory}
                onChange={(val) => setEditCategory(val)}
                className="w-full"
                options={[
                  { value: "Hỏi đáp", label: "Hỏi đáp" },
                  { value: "Kinh nghiệm", label: "Kinh nghiệm" },
                  { value: "Thảo luận chung", label: "Thảo luận chung" },
                ]}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-content-input"
              className="mb-1.5 block text-[13px] font-[600] text-gray-700"
            >
              Nội dung bài viết
            </label>
            <TextArea
              id="edit-content-input"
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Nhập nội dung chia sẻ hoặc thắc mắc của bà con…"
            />
          </div>

          {/* Tags management */}
          <div>
            <label
              htmlFor="edit-tags-input"
              className="mb-1.5 block text-[13px] font-[600] text-gray-700"
            >
              Nhãn chủ đề (Ấn Enter để lưu nhãn)
            </label>
            <Input
              id="edit-tags-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Ví dụ: bạc lá, bón phân…"
            />
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {editTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded border border-emerald-500/10 bg-emerald-50 px-2 py-1 text-xs font-semibold text-[#2F9E44]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Xóa nhãn ${tag}`}
                    className="font-extrabold hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
