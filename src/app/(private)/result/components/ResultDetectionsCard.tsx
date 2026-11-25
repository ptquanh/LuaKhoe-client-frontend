"use client";

import { ScanSearch } from "lucide-react";

export interface DetectionResultItem {
  id?: string;
  disease?: string | { name?: string };
  color?: string | null;
  confidence?: number;
  affectedAreaRatio?: number;
}

interface ResultDetectionsCardProps {
  results: DetectionResultItem[];
}

function getAreaSeverity(areaRatio: number) {
  if (areaRatio > 0.35) {
    return {
      label: "Nguy cấp",
      badgeClass: "bg-error/15 text-error border-error/25",
      barClass: "bg-error",
    };
  }
  if (areaRatio > 0.15) {
    return {
      label: "Trung bình",
      badgeClass: "bg-accent-light text-accent border-accent/25",
      barClass: "bg-amber-500",
    };
  }
  return {
    label: "Nhẹ",
    badgeClass: "bg-primary-soft text-primary border-primary-border",
    barClass: "bg-primary",
  };
}

export function ResultDetectionsCard({ results }: ResultDetectionsCardProps) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <section className="border-border bg-bg-card rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="border-border mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
        <div className="flex items-center gap-3">
          <div className="bg-accent-light text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <ScanSearch className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-heading text-text-primary text-base font-bold sm:text-lg">
              Chi tiết vùng bệnh chẩn đoán
            </h3>
            <p className="text-text-secondary text-xs">
              Tỷ lệ nhận diện và mức độ tổn thương trên ảnh lá lúa
            </p>
          </div>
        </div>
        <span className="border-border bg-bg-subtle text-text-secondary rounded-full border px-3 py-1 text-xs font-semibold tabular-nums">
          {results.length} vùng phát hiện
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {results.map((res, idx) => {
          const name =
            typeof res.disease === "string"
              ? res.disease
              : res.disease?.name || "Bệnh lúa";
          const color = res.color || "#D97706";
          const rawConf = res.confidence ?? 0;
          const confPercent =
            rawConf <= 1 ? Math.round(rawConf * 100) : Math.round(rawConf);
          const clampedConf = Math.max(0, Math.min(100, confPercent));
          const areaRatio = res.affectedAreaRatio ?? 0;
          const areaPercent = Math.max(
            0,
            Math.min(100, Number((areaRatio * 100).toFixed(1))),
          );
          const areaSeverity = getAreaSeverity(areaRatio);

          return (
            <div
              key={res.id || `${name}-${idx}`}
              className="border-border bg-bg-subtle/60 hover:border-primary/40 space-y-3 rounded-xl border p-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 rounded-sm border border-black/15 dark:border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-text-primary truncate text-[15px] font-bold">
                    {name}
                  </span>
                </div>
                <span className="border-border bg-bg-card text-text-muted shrink-0 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums">
                  #{idx + 1}
                </span>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">
                    Độ tin cậy AI
                  </span>
                  <span className="text-text-primary font-bold tabular-nums">
                    {clampedConf}%
                  </span>
                </div>
                <div className="bg-border h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${clampedConf}%` }}
                  />
                </div>
              </div>

              {/* Affected Area Meter */}
              {areaRatio > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-text-secondary font-medium">
                      Diện tích nhiễm
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${areaSeverity.badgeClass}`}
                      >
                        {areaSeverity.label}
                      </span>
                      <span
                        className={`font-bold tabular-nums ${
                          areaRatio > 0.35 ? "text-error" : "text-text-primary"
                        }`}
                      >
                        {areaPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-border h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${areaSeverity.barClass}`}
                      style={{ width: `${Math.max(4, areaPercent)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
