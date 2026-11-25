"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import CommentSection from "@/components/forum/CommentSection";
import PostCard from "@/components/forum/PostCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useForumPostDetail } from "@/hooks/useForum";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  // Load single post details via React Query
  const { data: response, isLoading, isError } = useForumPostDetail(id);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[800px] flex-col gap-4 pb-8">
        <Skeleton className="h-9 w-40 rounded-lg" />
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !response || !response.success || !response.data) {
    notFound();
  }

  const post = response.data;

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-4 pb-8">
      {/* Back Button */}
      <Link
        href="/forum"
        className="flex min-h-10 w-fit items-center gap-2 rounded-lg px-1 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Quay lại diễn đàn</span>
      </Link>

      {/* Main Post */}
      <div className="mt-1">
        <PostCard post={post} />
      </div>

      {/* Comments Area */}
      <CommentSection postId={post.id} initialIsOpen={true} />
    </div>
  );
}
