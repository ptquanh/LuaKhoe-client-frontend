"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  FileText,
  Image,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminService } from "@/services/admin.service";
import { formatConfidenceToPercent } from "@/utils/format";

export default function AdminDashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: () => adminService.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  const statsResponse = dashboardData?.data || {};
  const totalFarmers = statsResponse.totalFarmers || 0;
  const totalDiagnoses = statsResponse.totalDiagnoses || 0;
  const diagnosesThisWeek = statsResponse.diagnosesThisWeek || 0;
  const totalRagChunks = statsResponse.totalRagChunks || 0;
  const recentDiagnoses = statsResponse.recentDiagnoses || [];

  const statsList = [
    {
      label: "Nông dân tham gia",
      value: totalFarmers.toLocaleString(),
      change: "Hoạt động",
      icon: Users,
      color: "#2F9E44",
    },
    {
      label: "Tổng lượt quét ảnh",
      value: totalDiagnoses.toLocaleString(),
      change: "Tích lũy",
      icon: Image,
      color: "#1976D2",
    },
    {
      label: "Quét ảnh tuần này",
      value: diagnosesThisWeek.toLocaleString(),
      change:
        totalDiagnoses > 0
          ? `+${((diagnosesThisWeek / totalDiagnoses) * 100).toFixed(1)}%`
          : "0%",
      icon: TrendingUp,
      color: "#FB8C00",
    },
    {
      label: "Mảnh tri thức RAG",
      value: totalRagChunks.toLocaleString(),
      change: "Đã nạp",
      icon: FileText,
      color: "#E53935",
    },
  ];

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "—";
    try {
      const date = new Date(timeStr);
      return (
        date.toLocaleDateString("vi-VN") +
        " " +
        date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="Dashboard"
        description="Tổng quan hệ thống Lúa Khoẻ AI"
      />

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsList.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-xs transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: s.color + "1A" }}
                >
                  <Icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--primary)] tabular-nums">
                  <TrendingUp className="h-3 w-3" /> {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                {s.value}
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* System Status + Recent */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Status */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xs">
          <h2 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
            Trạng thái hệ thống
          </h2>
          <div className="space-y-3">
            {[
              { label: "API Server", status: "Online" },
              { label: "AI Inference Service (ONNX)", status: "Active" },
              { label: "RAG Pipeline", status: "Active" },
              { label: "PostgreSQL Database", status: "Connected" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0"
              >
                <span className="text-sm text-[var(--text-secondary)]">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  <span className="text-[13px] font-medium text-[var(--primary)]">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Diagnoses */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xs lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Chẩn đoán gần đây
            </h2>
            <Activity className="h-4 w-4 text-[var(--text-muted)]" />
          </div>

          {recentDiagnoses.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-muted)]">
              Chưa có lượt chẩn đoán nào được thực hiện.
            </p>
          ) : (
            <>
              {/* Mobile card list */}
              <div className="space-y-3 md:hidden">
                {recentDiagnoses.map((d: any) => (
                  <div
                    key={d.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {d.farmer}
                      </span>
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          d.confidence >= 0.95 || d.confidence >= 95
                            ? "text-emerald-600 dark:text-emerald-400"
                            : d.confidence >= 0.9 || d.confidence >= 90
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatConfidenceToPercent(d.confidence)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {d.disease}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--text-muted)] tabular-nums">
                      {formatTime(d.time)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="py-3 text-left text-[13px] font-semibold text-[var(--text-secondary)]">
                        Nông dân
                      </th>
                      <th className="py-3 text-left text-[13px] font-semibold text-[var(--text-secondary)]">
                        Bệnh phát hiện
                      </th>
                      <th className="py-3 text-center text-[13px] font-semibold text-[var(--text-secondary)]">
                        Độ tin cậy
                      </th>
                      <th className="py-3 text-right text-[13px] font-semibold text-[var(--text-secondary)]">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDiagnoses.map((d: any) => (
                      <tr
                        key={d.id}
                        className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--bg-hover)]"
                      >
                        <td className="py-3 text-sm font-medium text-[var(--text-primary)]">
                          {d.farmer}
                        </td>
                        <td className="py-3 text-sm text-[var(--text-secondary)]">
                          {d.disease}
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`text-[13px] font-semibold tabular-nums ${
                              d.confidence >= 0.95 || d.confidence >= 95
                                ? "text-emerald-600 dark:text-emerald-400"
                                : d.confidence >= 0.9 || d.confidence >= 90
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {formatConfidenceToPercent(d.confidence)}
                          </span>
                        </td>
                        <td className="py-3 text-right text-[13px] text-[var(--text-muted)] tabular-nums">
                          {formatTime(d.time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
