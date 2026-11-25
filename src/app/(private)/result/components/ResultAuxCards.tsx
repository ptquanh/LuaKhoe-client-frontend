"use client";

import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Skeleton } from "@/components/ui/Skeleton";

export function ResultSkeleton() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-72 rounded-2xl lg:col-span-7" />
        <Skeleton className="h-72 rounded-2xl lg:col-span-5" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

interface ResultErrorStateProps {
  error: string | null;
  onBack: () => void;
}

export function ResultErrorState({ error, onBack }: ResultErrorStateProps) {
  return (
    <div className="mx-auto max-w-[900px] pb-8">
      <button
        type="button"
        onClick={onBack}
        className="text-text-secondary hover:text-text-primary mb-6 flex min-h-10 cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </button>
      <div className="border-error/30 bg-error/10 flex flex-col items-center justify-center gap-3 rounded-2xl border p-8 text-center">
        <AlertTriangle className="text-error h-10 w-10" />
        <h2 className="font-heading text-text-primary text-lg font-bold">
          Không tải được chẩn đoán
        </h2>
        <p className="text-error text-sm">
          {error || "Dữ liệu không tồn tại hoặc đã bị xóa."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-error mt-2 min-h-11 cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}

export function ResultSupplementBanner() {
  return (
    <section className="border-primary-border bg-primary-soft/55 flex flex-col gap-4 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-center sm:p-5">
      <div className="bg-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-xs">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-heading text-text-primary text-sm font-bold sm:text-base">
            Tối ưu hóa độ chính xác (Re-scoring)
          </h4>
          <span className="border-primary-border bg-bg-card text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold">
            <CheckCircle2 className="h-3 w-3" /> Đã hiệu chỉnh
          </span>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed sm:text-sm">
          Hệ thống đã chấm điểm lại bằng thuật toán{" "}
          <strong className="text-text-primary">Weighted Re-scoring</strong> dựa
          trên ảnh cận cảnh bổ sung.
        </p>
      </div>
    </section>
  );
}

interface ResultSourcesCardProps {
  sourcesUsed?: string[];
  confidenceNote?: string;
}

export function ResultSourcesCard({
  sourcesUsed,
  confidenceNote,
}: ResultSourcesCardProps) {
  return (
    <section className="border-border bg-bg-subtle/70 space-y-3 rounded-2xl border p-5">
      <div className="flex items-center gap-2">
        <BookOpen className="text-primary h-4 w-4 shrink-0" />
        <h4 className="font-heading text-text-primary text-sm font-bold">
          Nguồn tham khảo & Lưu ý
        </h4>
      </div>
      {sourcesUsed?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {sourcesUsed.map((src, idx) => (
            <span
              key={idx}
              className="border-border bg-bg-card text-text-secondary rounded-md border px-2 py-0.5 text-[11px] font-medium"
            >
              {src}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-text-secondary text-xs">
          Hệ thống chuyên gia Lúa Khỏe, IRRI Rice Knowledge Bank
        </p>
      )}
      <p className="border-border/70 text-text-secondary border-t pt-2.5 text-xs leading-relaxed">
        <span className="text-text-primary font-semibold">Lưu ý: </span>
        {confidenceNote ||
          "Kết quả mang tính hỗ trợ quyết định. Nếu triệu chứng không cải thiện sau 7 ngày, hãy liên hệ cán bộ khuyến nông địa phương."}
      </p>
    </section>
  );
}
