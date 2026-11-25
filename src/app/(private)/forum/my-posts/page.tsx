"use client";

import { Button, Image, Input, message, Modal, Select, Tabs } from "antd";
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
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import PostStatusBadge from "@/components/forum/PostStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDeletePost, useMyPosts } from "@/hooks/useForum";
import { forumService } from "@/services/forum.service";
import { ForumPost } from "@/types/forum.type";

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
    <div className="mx-auto flex max-w-[800px] flex-col gap-5 pb-8">
      {/* Header */}
      <PageHeader
        title="Bài viết của tôi"
        description="Xem lịch sử đăng bài, quản lý bản nháp và theo dõi trạng thái kiểm duyệt bài viết."
        className="mb-0"
        actions={
          <div className="relative w-full shrink-0 sm:w-[260px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]">
              <Search className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết…"
              aria-label="Tìm kiếm bài viết của tôi"
              className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-2 pr-4 pl-10 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none sm:text-sm"
            />
          </div>
        }
      />

      {/* Segmented Control Navigation */}
      <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-1">
        <Link
          href="/forum"
          className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg py-2 text-center text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span>Diễn đàn chung</span>
        </Link>
        <Link
          href="/forum/my-posts"
          className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--bg-card)] py-2 text-center text-sm font-bold text-[var(--primary)] shadow-xs focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          <span>Bài viết của tôi</span>
        </Link>
      </div>

      {/* Tabs */}
      <div>
        <Tabs
          activeKey={activeTab}
          onChange={(key: string) => setActiveTab(key as StatusTab)}
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
        <div className="flex flex-col gap-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
            >
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" aria-hidden="true" />}
          title="Không tìm thấy bài viết nào"
          description="Bà con chưa có bài viết nào thuộc mục này."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-colors hover:border-[var(--primary)]/40"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1 tabular-nums">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
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
                <div className="flex flex-col items-end gap-1">
                  <PostStatusBadge
                    status={post.status}
                    rejectedBy={post.rejectedBy}
                  />
                </div>
              </div>

              {/* Content body */}
              <p className="mt-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-[var(--text-primary)]">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-block rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Attached images */}
              {post.images && post.images.length > 0 && (
                <Image.PreviewGroup>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {post.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video w-full overflow-hidden rounded-lg border border-[var(--border)]"
                      >
                        <Image
                          src={imgUrl || undefined}
                          alt="Preview"
                          className="object-cover"
                          style={{ width: "100%", height: "100%" }}
                          preview={{ mask: "Xem" }}
                        />
                      </div>
                    ))}
                  </div>
                </Image.PreviewGroup>
              )}

              {/* Reject reason overlay */}
              {post.status === "REJECTED" && post.flaggedReason && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                  <AlertTriangle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-bold">Lý do từ chối:</span>{" "}
                    {post.flaggedReason}
                  </div>
                </div>
              )}

              {/* Footer controls */}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5 border-t border-dashed border-[var(--border)] pt-3">
                {post.status === "DRAFT" && (
                  <button
                    type="button"
                    onClick={() => handleEditClick(post)}
                    className="flex min-h-10 items-center gap-1.5 rounded-xl bg-[var(--primary-soft)] px-3.5 py-2 text-xs font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/15 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
                  >
                    <Edit className="h-3.5 w-3.5" aria-hidden="true" /> Chỉnh
                    sửa & Đăng bài
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeletePost(post.id)}
                  className="flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/30"
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
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3 text-[var(--primary)]">
            <Edit className="h-5 w-5" aria-hidden="true" />
            <span className="text-base font-bold">
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
          <Button key="save" loading={isSaving} onClick={handleSaveDraftOnly}>
            Lưu bản nháp
          </Button>,
          <Button
            key="publish"
            type="primary"
            loading={isSaving}
            onClick={handlePublishDraft}
            icon={<Send className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Đăng công khai
          </Button>,
        ]}
        destroyOnHidden
        width={600}
      >
        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="edit-category-select"
                className="mb-1.5 block text-[13px] font-semibold text-[var(--text-secondary)]"
              >
                Thể loại bài đăng
              </label>
              <Select
                id="edit-category-select"
                value={editCategory}
                onChange={(val: string) => setEditCategory(val)}
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
              className="mb-1.5 block text-[13px] font-semibold text-[var(--text-secondary)]"
            >
              Nội dung bài viết
            </label>
            <TextArea
              id="edit-content-input"
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Nhập nội dung chia sẻ hoặc thắc mắc của bà con…"
              className="text-base sm:text-sm"
            />
          </div>

          {/* Tags management */}
          <div>
            <label
              htmlFor="edit-tags-input"
              className="mb-1.5 block text-[13px] font-semibold text-[var(--text-secondary)]"
            >
              Nhãn chủ đề (Ấn Enter để lưu nhãn)
            </label>
            <Input
              id="edit-tags-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Ví dụ: bạc lá, bón phân…"
              className="text-base sm:text-sm"
            />
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {editTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Xóa nhãn ${tag}`}
                    className="rounded p-0.5 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
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
