"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import CommentSection from "@/components/forum/CommentSection";
import PostCard from "@/components/forum/PostCard";
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
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#2F9E44]" />
        <p className="mt-4 text-[14px] text-[#5C5C5C] dark:text-gray-400">
          Đang tải chi tiết bài viết...
        </p>
      </div>
    );
  }

  if (isError || !response || !response.success || !response.data) {
    notFound();
  }

  const post = response.data;

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-4 pb-20">
      {/* Back Button */}
      <Link
        href="/forum"
        className="flex w-fit items-center gap-2 text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:text-[#2F9E44] dark:text-gray-400 dark:hover:text-green-400"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Quay lại diễn đàn</span>
      </Link>

      {/* Main Post */}
      <div className="mt-2">
        <PostCard post={post} />
      </div>

      {/* Comments Area */}
      <CommentSection postId={post.id} initialIsOpen={true} />
    </div>
  );
}
