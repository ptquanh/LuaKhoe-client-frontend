import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import PostCard from "@/components/forum/PostCard";
import CommentSection from "@/components/forum/CommentSection";
import { MOCK_POSTS, MOCK_COMMENTS } from "@/services/mock/forum.mock";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Find post in mock data
  const post = MOCK_POSTS.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  // Get mock comments for this post
  const comments = MOCK_COMMENTS.filter((c) => c.postId === id);

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-4 pb-20">
      {/* Back Button */}
      <Link 
        href="/forum"
        className="flex w-fit items-center gap-2 text-[14px] font-[500] text-[#5C5C5C] hover:text-[#2F9E44] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Quay lại diễn đàn</span>
      </Link>

      {/* Main Post */}
      <div className="mt-2">
        <PostCard post={post} />
      </div>

      {/* Comments Area */}
      <CommentSection comments={comments} />
    </div>
  );
}
