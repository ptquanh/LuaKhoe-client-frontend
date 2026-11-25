"use client";

import { useRouter } from "next/navigation";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DiagnosisResponse } from "@/types/diagnose.type";

interface HistoryCardProps {
  item: DiagnosisResponse;
}

const sevBadgeClasses: Record<string, string> = {
  low: "bg-primary-light text-primary border border-primary-border",
  medium:
    "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60",
  high: "bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/60",
  critical:
    "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/60",
};

export function HistoryCard({ item }: HistoryCardProps) {
  const router = useRouter();

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

  const feedback = item.feedbacks?.[0];
  const rawStatus = feedback?.status?.toUpperCase();

  let fbStatusText = "Chưa gửi phản hồi";
  let fbBadgeClass = "bg-bg-subtle text-text-secondary";

  if (rawStatus === "PENDING") {
    fbStatusText = "Chờ phản hồi";
    fbBadgeClass = "bg-accent-light text-accent";
  } else if (rawStatus === "APPROVED") {
    fbStatusText = "Đã duyệt";
    fbBadgeClass = "bg-primary-light text-primary";
  } else if (rawStatus === "REJECTED") {
    fbStatusText = "Đã từ chối";
    fbBadgeClass = "bg-error/15 text-error";
  }

  const primaryDiseaseName = displayResults[0].disease?.name || "Khỏe mạnh";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/result?id=${item.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/result?id=${item.id}`);
        }
      }}
      className="group border-border bg-bg-card focus-visible:ring-primary flex cursor-pointer flex-row overflow-hidden rounded-2xl border shadow-xs transition-all hover:shadow-md focus-visible:ring-2 focus-visible:outline-none sm:flex-col"
    >
      <div className="bg-bg-subtle relative h-32 w-28 shrink-0 overflow-hidden sm:aspect-square sm:h-auto sm:w-full">
        <ImageWithFallback
          src={item.resultImageUrl || item.originalImageUrl}
          alt={`Kết quả chẩn đoán ${primaryDiseaseName}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-0 bottom-0 left-0 hidden flex-wrap gap-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 sm:flex">
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
            const sc = sevBadgeClasses[severity] || sevBadgeClasses.low;
            const rawConf = res.confidence ?? 0;
            const confPercent =
              rawConf <= 1 ? Math.round(rawConf * 100) : Math.round(rawConf);

            return (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold shadow-xs backdrop-blur-sm ${sc}`}
              >
                {dName}
                {dName !== "Khỏe mạnh" && (
                  <span className="text-[10px] font-bold tabular-nums opacity-85">
                    ({confPercent}%)
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5">
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-text-secondary text-xs tabular-nums">
              {dateStr}
            </span>
            <span
              className={`text-xs font-semibold ${isHealthy ? "text-primary" : "text-accent"}`}
            >
              {isHealthy
                ? "Cây khỏe mạnh"
                : `${displayResults.length} phát hiện`}
            </span>
          </div>

          <p className="text-text-primary line-clamp-1 text-sm font-bold sm:hidden">
            {displayResults
              .map((r: any) => r.disease?.name || "Khỏe mạnh")
              .join(", ")}
          </p>
        </div>

        <div className="border-border mt-2 flex items-center justify-between gap-2 border-t pt-2">
          <span className="text-text-secondary text-[11px]">Phản hồi AI:</span>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${fbBadgeClass}`}
          >
            {fbStatusText}
          </span>
        </div>
      </div>
    </div>
  );
}
