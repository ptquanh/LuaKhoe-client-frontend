"use client";

import {
  Clock,
  Filter,
  Flame,
  Globe,
  History,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import CreatePostWidget from "@/components/forum/CreatePostWidget";
import PostCard from "@/components/forum/PostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { useForumPosts } from "@/hooks/useForum";

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"hot" | "new">("hot");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  // Fetch infinite posts from server via React Query hook
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useForumPosts({
    sort,
    tag: selectedTag,
    limit: 10,
  });

  // Flatten the loaded pages into a single flat array
  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.items || []) || [];
  }, [data]);

  // Client-side search filtering over retrieved items
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;

    const query = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const matchContent = post.content.toLowerCase().includes(query);
      const matchAuthor = post.author.name.toLowerCase().includes(query);
      const matchTags = post.tags?.some((tag) =>
        tag.toLowerCase().includes(query),
      );

      return matchContent || matchAuthor || matchTags;
    });
  }, [posts, searchQuery]);

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-5 pb-8">
      <PageHeader
        title="Diễn đàn nông dân"
        description="Nơi giao lưu, hỏi đáp và chia sẻ kinh nghiệm canh tác"
        className="mb-0"
        actions={
          <div className="relative w-full shrink-0 sm:w-[280px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]">
              <Search className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài viết, kỹ thuật…"
              aria-label="Tìm kiếm bài viết trên diễn đàn"
              className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-2.5 pr-4 pl-10 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none sm:text-sm"
            />
          </div>
        }
      />

      {/* Segmented Control Navigation */}
      <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-1">
        <Link
          href="/forum"
          className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--bg-card)] py-2 text-center text-sm font-bold text-[var(--primary)] shadow-xs focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span>Diễn đàn chung</span>
        </Link>
        <Link
          href="/forum/my-posts"
          className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg py-2 text-center text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          <span>Bài viết của tôi</span>
        </Link>
      </div>

      {/* Create Post Area */}
      <CreatePostWidget />

      {/* Sort & Filter */}
      <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto border-b border-[var(--border)] pb-3">
        <button
          onClick={() => {
            setSort("hot");
            setSelectedTag(undefined);
          }}
          className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            sort === "hot" && !selectedTag
              ? "bg-[var(--primary-soft)] text-[var(--primary)]"
              : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
          }`}
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          <span>Hot nhất</span>
        </button>

        <button
          onClick={() => {
            setSort("new");
            setSelectedTag(undefined);
          }}
          className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            sort === "new" && !selectedTag
              ? "bg-[var(--primary-soft)] text-[var(--primary)]"
              : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
          }`}
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>Mới nhất</span>
        </button>

        <button
          onClick={() => {
            setSelectedTag(selectedTag === "Đạo ôn" ? undefined : "Đạo ôn");
          }}
          className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            selectedTag === "Đạo ôn"
              ? "bg-[var(--primary-soft)] text-[var(--primary)]"
              : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
          }`}
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span>Bệnh đạo ôn</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Không thể tải dữ liệu diễn đàn"
            description="Vui lòng thử lại sau hoặc kiểm tra kết nối mạng."
          />
        ) : filteredPosts.length > 0 ? (
          <>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Load More Trigger */}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-3 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Đang tải thêm…</span>
                  </>
                ) : (
                  <span>Xem thêm bài viết</span>
                )}
              </button>
            )}
          </>
        ) : (
          <EmptyState
            icon={<Search className="h-6 w-6" aria-hidden="true" />}
            title="Không tìm thấy bài viết nào"
            description="Thử sử dụng các từ khóa khác xem sao (ví dụ: đạo ôn, ST25…)"
          />
        )}
      </div>
    </div>
  );
}
