"use client";

import { Spin } from "antd";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Lazy load các component con để giảm bundle size và tăng performance
const AdminForumFeed = dynamic(() => import("./_components/AdminForumFeed"), {
  loading: () => (
    <div className="flex h-64 items-center justify-center">
      <Spin size="large" description="Đang tải dòng thời gian…" />
    </div>
  ),
});

const AdminForumModeration = dynamic(
  () => import("./_components/AdminForumModeration"),
  {
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" description="Đang tải dữ liệu kiểm duyệt…" />
      </div>
    ),
  },
);

// ==========================================
// DASHBOARD WRAPPER & TAB STATE MANAGER
// ==========================================
function ForumManagementDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL-Synchronized Tab state
  const activeMainTab = searchParams.get("tab") || "feed";

  const handleTabChange = (newTab: "feed" | "moderation") => {
    // router.push without full page reload
    router.push(`${pathname}?tab=${newTab}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      {/* Header Info */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B] dark:text-white">
            Quản lý Diễn đàn
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C] dark:text-gray-400">
            Quản trị bảng tin bài đăng công khai và kiểm duyệt chất lượng nội
            dung nông nghiệp.
          </p>
        </div>

        {/* Sparkles dynamic badge */}
        <div className="rounded-lg border border-[#2F9E44]/20 bg-[#E6F4EA] px-4 py-2 dark:bg-emerald-950/15">
          <div className="flex items-center gap-2 text-[#2E7D32] dark:text-emerald-400">
            <Sparkles
              className="h-4 w-4 animate-pulse text-[#2F9E44]"
              aria-hidden="true"
            />
            <span className="text-[13px] font-semibold">
              Tự động hóa AI đang kích hoạt
            </span>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="mb-6 flex gap-6 border-b border-[#E0E0E0] dark:border-gray-800">
        <button
          onClick={() => handleTabChange("feed")}
          className={`cursor-pointer border-b-2 pb-2.5 text-[15px] font-[600] transition-all ${
            activeMainTab === "feed"
              ? "border-[#2F9E44] text-[#2F9E44] dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-[#5C5C5C] hover:text-[#1B1B1B] dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Bảng tin diễn đàn
        </button>
        <button
          onClick={() => handleTabChange("moderation")}
          className={`cursor-pointer border-b-2 pb-2.5 text-[15px] font-[600] transition-all ${
            activeMainTab === "moderation"
              ? "border-[#2F9E44] text-[#2F9E44] dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-[#5C5C5C] hover:text-[#1B1B1B] dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Kiểm duyệt bài viết
        </button>
      </div>

      {/* Subpage Router */}
      <div className="mt-6">
        {activeMainTab === "moderation" ? (
          <AdminForumModeration />
        ) : (
          <AdminForumFeed />
        )}
      </div>
    </div>
  );
}

// Default export wrapper bọc Suspense để Next.js build-time an toàn
export default function AdminForumPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Spin
            size="large"
            description="Đang tải dữ liệu quản trị diễn đàn…"
          />
        </div>
      }
    >
      <ForumManagementDashboard />
    </Suspense>
  );
}
