"use client";

import { useRouter } from "next/navigation";
import React from "react";

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

  // Sort results by confidence descending and deduplicate by disease name
  const uniqueResults = item.results
    ? item.results
        .reduce((acc: any[], curr: any) => {
          const name = curr.disease?.name || "Khỏe mạnh";
          if (
            !acc.some((i: any) => (i.disease?.name || "Khỏe mạnh") === name)
          ) {
            acc.push(curr);
          }
          return acc;
        }, [])
        .sort((a: any, b: any) => b.confidence - a.confidence)
    : [];

  const displayResults =
    uniqueResults.length > 0
      ? uniqueResults
      : [{ disease: { name: "Khỏe mạnh" }, confidence: 1.0 }];

  const dateStr = new Date(item.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isHealthy =
    displayResults.length === 1 &&
    displayResults[0].disease?.name === "Khỏe mạnh";

  return (
    <div
      onClick={() => router.push(`/result?id=${item.id}`)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-[#E0E0E0] bg-white transition-all hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F7F7F7]">
        <ImageWithFallback
          src={item.resultImageUrl || item.originalImageUrl}
          alt="Diagnosis Result"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-0 bottom-0 left-0 flex flex-wrap gap-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
          {displayResults.map((res: any, idx: number) => {
            const dName = res.disease?.name || "Khỏe mạnh";
            let severity = "low";
            const nameLower = dName.toLowerCase();
            if (nameLower.includes("đạo ôn") || nameLower.includes("khô vằn")) {
              severity = "high";
            } else if (
              nameLower.includes("bạc lá") ||
              nameLower.includes("đốm nâu")
            ) {
              severity = "medium";
            }
            const sc = sevColors[severity] || sevColors.low;
            const rawConf = res.confidence ?? 0;
            const confPercent =
              rawConf <= 1 ? Math.round(rawConf * 100) : Math.round(rawConf);

            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-[600] shadow-sm backdrop-blur-sm"
                style={{ backgroundColor: sc.bg, color: sc.text }}
              >
                {dName}
                {dName !== "Khỏe mạnh" && (
                  <span className="text-[9px] font-bold opacity-80">
                    ({confPercent}%)
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#5C5C5C]">{dateStr}</span>
          <span
            className={`text-[12px] font-[600] ${isHealthy ? "text-[#2F9E44]" : "text-[#E65100]"}`}
          >
            {isHealthy ? "Cây khỏe mạnh" : `${displayResults.length} phát hiện`}
          </span>
        </div>
      </div>
    </div>
  );
}
