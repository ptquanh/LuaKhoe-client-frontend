"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import React from "react";

interface UrgentActionsCardProps {
  urgentActions: string[];
  checkedActions: boolean[];
  onToggleAction: (index: number) => void;
}

export function UrgentActionsCard({
  urgentActions,
  checkedActions,
  onToggleAction,
}: UrgentActionsCardProps) {
  const completedCount = checkedActions.filter(Boolean).length;
  const totalCount = urgentActions.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white shadow-sm transition-all hover:shadow-md">
      <div className="border-b border-[#E0E0E0] bg-gradient-to-r from-[#FFF9F0] to-white px-6 py-4.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF3E0] text-[#E65100]">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
                Việc cần làm ngay hôm nay
              </h3>
              <p className="text-[13px] text-[#757575]">
                Thực hiện gấp để ngăn chặn bệnh lây lan nhanh
              </p>
            </div>
          </div>

          {/* Progress badge */}
          <div className="flex items-center gap-3 self-start rounded-xl border border-black/5 bg-[#F7F7F7] px-3.5 py-2 md:self-center">
            <div className="flex flex-col text-right">
              <span className="text-[12px] font-[600] text-[#5C5C5C]">
                Đã hoàn thành
              </span>
              <span className="text-[14px] font-[800] text-[#2F9E44]">
                {completedCount} / {totalCount}
              </span>
            </div>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F4EA]">
              <CheckCircle2 className="h-5 w-5 text-[#2F9E44]" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4.5 h-2 w-full overflow-hidden rounded-full bg-[#E0E0E0]">
          <div
            className="h-full rounded-full bg-[#2F9E44] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 p-6">
        {urgentActions.map((action, i) => {
          const isChecked = checkedActions[i] || false;
          return (
            <label
              key={i}
              className={`group flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-200 ${
                isChecked
                  ? "border-[#2F9E44]/30 bg-[#E6F4EA]/40 text-[#757575]"
                  : "border-[#E0E0E0] bg-white hover:border-[#FB8C00] hover:bg-[#FFF9F0]/50"
              }`}
            >
              <div className="relative flex items-center justify-center pt-0.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleAction(i)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-[#BDBDBD] bg-white transition-all checked:border-[#2F9E44] checked:bg-[#2F9E44] hover:border-[#FB8C00] focus:outline-none"
                />
                <svg
                  className="pointer-events-none absolute h-3.5 w-3.5 stroke-white stroke-[3] opacity-0 transition-opacity peer-checked:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span
                className={`text-[15px] leading-[1.5] font-[500] transition-all duration-200 ${
                  isChecked
                    ? "text-[#9E9E9E] line-through"
                    : "text-[#1B1B1B] group-hover:text-[#E65100]"
                }`}
              >
                {action}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
