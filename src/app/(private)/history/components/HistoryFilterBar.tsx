"use client";

import { ArrowUpDown, Calendar, Filter, Search } from "lucide-react";
import React from "react";

interface HistoryFilterBarProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  diseaseFilter: string;
  setDiseaseFilter: (disease: string) => void;
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
  timeFilter,
  setTimeFilter,
  sortFilter,
  setSortFilter,
  totalCount,
}: HistoryFilterBarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm bệnh, mô tả..."
          className="h-10 w-full rounded-lg border border-[#E0E0E0] bg-white pr-3 pl-9 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-[#5C5C5C]" />
        <select
          value={diseaseFilter}
          onChange={(e) => setDiseaseFilter(e.target.value)}
          className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-3 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
        >
          {diseases.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-[#5C5C5C]" />
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-3 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
        >
          {times.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-[#5C5C5C]" />
        <select
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
          className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-3 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <span className="ml-auto rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1.5 text-[14px] font-[600] text-[#5C5C5C]">
        {totalCount} kết quả
      </span>
    </div>
  );
}
