"use client";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import React from "react";

interface ResultHeroCardProps {
  diseaseName: string;
  severity: string;
  confidence: number;
  isHealthy?: boolean;
  severityAssessment?: string | null;
  summary?: string | null;
  createdAt?: string | null;
  province?: string | null;
  detectionsCount?: number;
  maxAffectedArea?: number;
}

const severityConfig: Record<
  string,
  {
    accentBar: string;
    badgeBg: string;
    badgeBorder: string;
    text: string;
    ringStroke: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  low: {
    accentBar: "bg-primary",
    badgeBg: "bg-primary-soft",
    badgeBorder: "border-primary-border",
    text: "text-primary",
    ringStroke: "stroke-primary",
    label: "Mức độ nhẹ",
    icon: CheckCircle2,
  },
  medium: {
    accentBar: "bg-amber-500",
    badgeBg: "bg-accent-light",
    badgeBorder: "border-amber-300/60 dark:border-amber-700/50",
    text: "text-amber-700 dark:text-amber-300",
    ringStroke: "stroke-amber-500",
    label: "Trung bình",
    icon: AlertTriangle,
  },
  high: {
    accentBar: "bg-orange-500",
    badgeBg: "bg-orange-500/12",
    badgeBorder: "border-orange-400/40",
    text: "text-orange-700 dark:text-orange-300",
    ringStroke: "stroke-orange-500",
    label: "Mức độ nặng",
    icon: AlertTriangle,
  },
  critical: {
    accentBar: "bg-error",
    badgeBg: "bg-error/12",
    badgeBorder: "border-error/30",
    text: "text-error",
    ringStroke: "stroke-error",
    label: "Cấp bách",
    icon: ShieldAlert,
  },
};

function formatDateTime(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ResultHeroCard({
  diseaseName,
  severity,
  confidence,
  isHealthy,
  severityAssessment,
  summary,
  createdAt,
  province,
  detectionsCount = 0,
  maxAffectedArea = 0,
}: ResultHeroCardProps) {
  const config = isHealthy
    ? {
        accentBar: "bg-primary",
        badgeBg: "bg-primary-soft",
        badgeBorder: "border-primary-border",
        text: "text-primary",
        ringStroke: "stroke-primary",
        label: "Lúa khỏe mạnh",
        icon: CheckCircle2,
      }
    : severityConfig[severity] || severityConfig.medium;

  const BadgeIcon = config.icon;
  const formattedTime = formatDateTime(createdAt);
  const clampedConfidence = Math.max(0, Math.min(100, confidence));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const areaPercent = Number((maxAffectedArea * 100).toFixed(1));

  return (
    <section className="border-border bg-bg-card relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border shadow-xs">
      <div className={`h-1.5 w-full ${config.accentBar}`} />

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-4">
          {/* Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${config.badgeBg} ${config.badgeBorder} ${config.text}`}
            >
              <BadgeIcon className="h-3.5 w-3.5" />
              {config.label.toUpperCase()}
            </span>

            {formattedTime && (
              <span className="border-border bg-bg-subtle text-text-secondary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tabular-nums">
                <CalendarClock className="text-text-muted h-3.5 w-3.5" />
                {formattedTime}
              </span>
            )}

            {province && (
              <span className="border-border bg-bg-subtle text-text-secondary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
                <MapPin className="text-primary h-3.5 w-3.5" />
                {province}
              </span>
            )}
          </div>

          {/* Disease Title + Confidence Donut */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-1.5">
              <h1 className="font-heading text-text-primary text-2xl leading-tight font-extrabold tracking-tight sm:text-[30px]">
                {diseaseName}
              </h1>
              {severityAssessment && !isHealthy && (
                <p className="text-text-secondary text-sm leading-snug font-medium">
                  {severityAssessment}
                </p>
              )}
            </div>

            {!isHealthy && (
              <div className="border-border bg-bg-subtle/70 flex shrink-0 items-center gap-3 self-start rounded-2xl border px-4 py-2.5 sm:self-center">
                <div className="relative h-14 w-14 shrink-0">
                  <svg
                    className="h-full w-full -rotate-90"
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      className="stroke-border"
                      strokeWidth="6.5"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      className={config.ringStroke}
                      strokeWidth="6.5"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={
                        circumference * (1 - clampedConfidence / 100)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-text-primary text-sm font-extrabold tabular-nums">
                      {clampedConfidence}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-primary text-xs font-bold">
                    Độ tin cậy AI
                  </span>
                  <span className="text-text-muted text-[11px]">
                    Mức độ khớp mẫu
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Executive Summary Callout */}
          {(summary || isHealthy) && (
            <div className="border-primary bg-bg-subtle/60 rounded-r-xl border-l-[3px] px-4 py-3">
              <p className="text-text-secondary text-sm leading-relaxed">
                {summary ||
                  "Mẫu lá lúa không ghi nhận dấu hiệu bệnh lý đáng lo ngại. Tiếp tục duy trì chế độ nước, bón phân cân đối và thăm đồng định kỳ."}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Telemetry Strip */}
        {!isHealthy && (
          <div className="border-border mt-5 grid grid-cols-3 gap-3 border-t pt-4">
            <div>
              <span className="text-text-muted block text-[11px] font-semibold uppercase">
                Độ tin cậy
              </span>
              <span className="text-text-primary mt-0.5 block text-base font-extrabold tabular-nums sm:text-lg">
                {clampedConfidence}%
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px] font-semibold uppercase">
                Diện tích nhiễm
              </span>
              <span
                className={`mt-0.5 block text-base font-extrabold tabular-nums sm:text-lg ${
                  maxAffectedArea > 0.35 ? "text-error" : "text-text-primary"
                }`}
              >
                {maxAffectedArea > 0 ? `${areaPercent}%` : "Chưa đo"}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px] font-semibold uppercase">
                Vùng phát hiện
              </span>
              <span className="text-text-primary mt-0.5 block text-base font-extrabold tabular-nums sm:text-lg">
                {detectionsCount || 1} vùng
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
