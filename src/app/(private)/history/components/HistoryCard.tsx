"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DiagnosisResponse } from "@/types/diagnose.type";

interface HistoryCardProps {
  item: DiagnosisResponse;
}

const sevColors: Record<string, { bg: string; text: string }> = {
  low: { bg: "#E6F4EA", text: "#2E7D32" },
  medium: { bg: "#FFF8E1", text: "#F57F17" },
  high: { bg: "#FFF3E0", text: "#E65100" },
  critical: { bg: "#FFEBEE", text: "#C62828" },
};

export function HistoryCard({ item }: HistoryCardProps) {
  const router = useRouter();

  // Sort results by confidence descending
  const sortedResults =
    item.results && item.results.length > 0
      ? [...item.results].sort((a, b) => b.confidence - a.confidence)
      : [];

  const topResult = sortedResults[0];
  const diseaseName = topResult?.disease?.name || "Khỏe mạnh";

  const rawConfidence = topResult?.confidence ?? 0;
  const confidencePercent =
    rawConfidence <= 1
      ? Math.round(rawConfidence * 100)
      : Math.round(rawConfidence);

  let severity = "low";
  const nameLower = diseaseName.toLowerCase();
  if (nameLower.includes("đạo ôn") || nameLower.includes("khô vằn")) {
    severity = "high";
  } else if (nameLower.includes("bạc lá") || nameLower.includes("đốm nâu")) {
    severity = "medium";
  }

  const sc = sevColors[severity] || sevColors.low;
  const dateStr = new Date(item.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      onClick={() => router.push(`/result?id=${item.id}`)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-[#E0E0E0] bg-white transition-all hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F7F7F7]">
        <ImageWithFallback
          src={item.resultImageUrl || item.originalImageUrl}
          alt={diseaseName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span
            className="inline-block rounded px-2 py-0.5 text-[11px] font-[600]"
            style={{ backgroundColor: sc.bg, color: sc.text }}
          >
            {diseaseName}
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#5C5C5C]">{dateStr}</span>
          <span className="text-[12px] font-[600] text-[#2F9E44]">
            Độ tin cậy: {confidencePercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
