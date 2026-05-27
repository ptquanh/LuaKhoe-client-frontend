"use client";

import { Filter, Flame, Clock, Search } from "lucide-react";
import { useState, useMemo } from "react";
import CreatePostWidget from "@/components/forum/CreatePostWidget";
import PostCard from "@/components/forum/PostCard";
import { MOCK_POSTS } from "@/services/mock/forum.mock";

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Logic tìm kiếm bài viết theo nội dung, tên người đăng hoặc tags
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_POSTS;
    
    const query = searchQuery.toLowerCase();
    return MOCK_POSTS.filter((post) => {
      const matchContent = post.content.toLowerCase().includes(query);
      const matchAuthor = post.author.name.toLowerCase().includes(query);
      const matchTags = post.tags?.some(tag => tag.toLowerCase().includes(query));
      
      return matchContent || matchAuthor || matchTags;
    });
  }, [searchQuery]);

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-[700] text-[#1B1B1B]">Diễn đàn nông dân</h1>
          <p className="text-[14px] text-[#5C5C5C]">Nơi giao lưu, hỏi đáp và chia sẻ kinh nghiệm canh tác</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-[300px] shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E9E9E]">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài viết, kỹ thuật..."
            className="w-full rounded-full border border-[#E0E0E0] bg-white py-2.5 pl-10 pr-4 text-[14px] text-[#1B1B1B] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:outline-none focus:ring-1 focus:ring-[#2F9E44]"
          />
        </div>
      </div>

      {/* Create Post Area */}
      <CreatePostWidget />

      {/* Sort & Filter */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-[#E0E0E0] pb-3">
        <button className="flex shrink-0 items-center gap-2 rounded-full bg-[#E6F4EA] px-4 py-2 text-[14px] font-[600] text-[#2F9E44]">
          <Flame className="h-4 w-4" />
          <span>Hot nhất</span>
        </button>
        <button className="flex shrink-0 items-center gap-2 rounded-full bg-white border border-[#E0E0E0] px-4 py-2 text-[14px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5]">
          <Clock className="h-4 w-4" />
          <span>Mới nhất</span>
        </button>
        <button className="flex shrink-0 items-center gap-2 rounded-full bg-white border border-[#E0E0E0] px-4 py-2 text-[14px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5]">
          <Filter className="h-4 w-4" />
          <span>Bệnh đạo ôn</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E0E0E0] bg-white py-12 text-center">
            <Search className="mb-3 h-10 w-10 text-[#9E9E9E]" />
            <p className="text-[16px] font-[500] text-[#1B1B1B]">Không tìm thấy bài viết nào</p>
            <p className="mt-1 text-[14px] text-[#5C5C5C]">Thử sử dụng các từ khóa khác xem sao (ví dụ: đạo ôn, ST25...)</p>
          </div>
        )}
      </div>
    </div>
  );
}
