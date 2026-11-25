"use client";

import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Filter,
  MessageSquareHeart,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

interface HistoryFilterBarProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  diseaseFilter: string;
  setDiseaseFilter: (disease: string) => void;
  feedbackStatusFilter: string;
  setFeedbackStatusFilter: (status: string) => void;
  timeFilter: string;
  setTimeFilter: (time: string) => void;
  sortFilter: string;
  setSortFilter: (sort: string) => void;
  totalCount: number;
}

const diseases = [
  "Tất cả",
  "Bệnh đạo ôn",
  "Bệnh bạc lá",
  "Bệnh khô vằn",
  "Bệnh đốm nâu",
  "Khỏe mạnh",
];

const feedbackStatuses = [
  "Tất cả",
  "Đã gửi phản hồi",
  "Chờ phản hồi",
  "Đã duyệt",
  "Đã từ chối",
  "Chưa gửi phản hồi",
];

const times = [
  { label: "Tất cả", value: "all" },
  { label: "7 ngày qua", value: "7d" },
  { label: "30 ngày qua", value: "30d" },
  { label: "3 tháng qua", value: "90d" },
];

const sorts = [
  { label: "Mới nhất", value: "-createdAt" },
  { label: "Cũ nhất", value: "createdAt" },
];

export function HistoryFilterBar({
  keyword,
  setKeyword,
  diseaseFilter,
  setDiseaseFilter,
  feedbackStatusFilter,
  setFeedbackStatusFilter,
  timeFilter,
  setTimeFilter,
  sortFilter,
  setSortFilter,
  totalCount,
}: HistoryFilterBarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFilterCount =
    (diseaseFilter !== "Tất cả" ? 1 : 0) +
    (feedbackStatusFilter !== "Tất cả" ? 1 : 0) +
    (timeFilter !== "all" ? 1 : 0) +
    (sortFilter !== "-createdAt" ? 1 : 0);

  return (
    <div className="border-border bg-bg-card mb-6 rounded-2xl border p-4 shadow-xs">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        {/* Search + Mobile Filter Trigger Row */}
        <div className="flex min-w-[220px] flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="text-text-secondary absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm bệnh, mô tả..."
              aria-label="Tìm kiếm lịch sử chẩn đoán"
              className="border-border bg-bg-card text-text-primary placeholder:text-text-muted focus:border-primary h-11 w-full rounded-xl border pr-3 pl-10 text-base focus:outline-none sm:h-10 sm:text-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="border-border bg-bg-subtle text-text-primary hover:bg-bg-hover flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-colors md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Lọc</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white tabular-nums">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Filter Selects */}
        <div
          className={`${
            showMobileFilters ? "grid" : "hidden"
          } grid-cols-1 gap-2.5 sm:grid-cols-2 md:flex md:flex-wrap md:items-center`}
        >
          <div className="flex items-center gap-2">
            <Filter className="text-text-secondary hidden h-4 w-4 shrink-0 md:block" />
            <select
              aria-label="Lọc theo loại bệnh"
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="border-border bg-bg-card text-text-primary focus:border-primary h-11 w-full cursor-pointer rounded-xl border px-3 text-base focus:outline-none sm:h-10 sm:text-sm md:w-auto"
            >
              {diseases.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MessageSquareHeart className="text-text-secondary hidden h-4 w-4 shrink-0 md:block" />
            <select
              aria-label="Lọc theo trạng thái phản hồi"
              value={feedbackStatusFilter}
              onChange={(e) => setFeedbackStatusFilter(e.target.value)}
              className="border-border bg-bg-card text-text-primary focus:border-primary h-11 w-full cursor-pointer rounded-xl border px-3 text-base focus:outline-none sm:h-10 sm:text-sm md:w-auto"
            >
              {feedbackStatuses.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="text-text-secondary hidden h-4 w-4 shrink-0 md:block" />
            <select
              aria-label="Lọc theo thời gian"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border-border bg-bg-card text-text-primary focus:border-primary h-11 w-full cursor-pointer rounded-xl border px-3 text-base focus:outline-none sm:h-10 sm:text-sm md:w-auto"
            >
              {times.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="text-text-secondary hidden h-4 w-4 shrink-0 md:block" />
            <select
              aria-label="Sắp xếp kết quả"
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="border-border bg-bg-card text-text-primary focus:border-primary h-11 w-full cursor-pointer rounded-xl border px-3 text-base focus:outline-none sm:h-10 sm:text-sm md:w-auto"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="border-border bg-bg-subtle text-text-secondary self-start rounded-xl border px-3 py-1.5 text-xs font-semibold tabular-nums md:ml-auto md:self-center md:text-sm">
          {totalCount} kết quả
        </span>
      </div>
    </div>
  );
}
