"use client";

import React from "react";

interface ResultHeroCardProps {
  diseaseName: string;
  severity: string;
  confidence: number;
  isHealthy?: boolean;
}

const severityConfig: Record<
  string,
  { bg: string; text: string; label: string; border: string }
> = {
  low: {
    bg: "bg-[#E6F4EA]",
    text: "text-[#2E7D32]",
    label: "Nhẹ",
    border: "border-[#A5D6A7]",
  },
  medium: {
    bg: "bg-[#FFF8E1]",
    text: "text-[#F57F17]",
    label: "Trung bình",
    border: "border-[#FFE082]",
  },
  high: {
    bg: "bg-[#FFF3E0]",
    text: "text-[#E65100]",
    label: "Nặng",
    border: "border-[#FFCC80]",
  },
  critical: {
    bg: "bg-[#FFEBEE]",
    text: "text-[#C62828]",
    label: "Nghiêm trọng",
    border: "border-[#EF9A9A]",
  },
};

export function ResultHeroCard({
  diseaseName,
  severity,
  confidence,
  isHealthy,
}: ResultHeroCardProps) {
  const config = isHealthy
    ? {
        bg: "bg-[#E6F4EA]",
        text: "text-[#2E7D32]",
        label: "Khỏe mạnh",
        border: "border-[#A5D6A7]",
      }
    : severityConfig[severity] || severityConfig.medium;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-sm transition-all duration-300 hover:shadow-md ${config.bg} ${config.border}`}
    >
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full bg-white px-3.5 py-1 text-[13px] font-[700] shadow-sm ${config.text}`}
            >
              <span
                className="currentColor mr-1.5 h-2 w-2 animate-pulse rounded-full"
                style={{ backgroundColor: "currentColor" }}
              />
              {config.label.toUpperCase()}
            </span>
            {!isHealthy && (
              <span className="rounded-full border border-black/5 bg-white/60 px-3 py-1 text-[13px] font-[500] text-[#5C5C5C]">
                Độ chính xác AI: {confidence}%
              </span>
            )}
          </div>

          <h1 className="text-[26px] leading-[1.25] font-[800] tracking-tight text-[#1B1B1B] md:text-[32px]">
            {diseaseName}
          </h1>
        </div>

        {/* Confidence Donut */}
        {!isHealthy && (
          <div className="flex shrink-0 items-center gap-3.5 self-start rounded-2xl border border-black/5 bg-white/80 px-4 py-3 shadow-sm md:self-center">
            <div className="relative h-15 w-15 shrink-0">
              <svg
                className="h-full w-full -rotate-90 transform"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="25"
                  stroke="#E0E0E0"
                  strokeWidth="7"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="25"
                  stroke="#2F9E44"
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 25}
                  strokeDashoffset={2 * Math.PI * 25 * (1 - confidence / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[14px] font-[800] text-[#2F9E44]">
                  {confidence}%
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-0.5">
              <span className="text-[14px] font-[700] text-[#1B1B1B]">
                Độ tin cậy
              </span>
              <span className="text-[12px] text-[#757575]">
                Mô hình AI phân tích
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
