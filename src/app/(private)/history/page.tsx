"use client";

import { History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants/routes";
import { diagnosisService } from "@/services/diagnosis.service";
import { DiagnosisResponse } from "@/types/diagnose.type";

import { HistoryCard } from "./components/HistoryCard";
import { HistoryFilterBar } from "./components/HistoryFilterBar";

export default function DiagnosisHistoryPage() {
  const [keyword, setKeyword] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("Tất cả");
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState("Tất cả");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const limit = 8;

  const [items, setItems] = useState<DiagnosisResponse[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      try {
        let fromDate: string | undefined = undefined;
        if (timeFilter === "7d") {
          fromDate = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
        } else if (timeFilter === "30d") {
          fromDate = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
        } else if (timeFilter === "90d") {
          fromDate = new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString();
        }

        const offset = (page - 1) * limit;

        const keywordParam =
          keyword.trim().length > 0 && keyword.trim().length < 3
            ? undefined
            : keyword.trim() || undefined;

        const res = await diagnosisService.getHistory({
          limit,
          offset,
          keyword: keywordParam,
          disease: diseaseFilter !== "Tất cả" ? diseaseFilter : undefined,
          feedbackStatus:
            feedbackStatusFilter !== "Tất cả"
              ? feedbackStatusFilter
              : undefined,
          fromDate,
          sort: sortFilter,
        });

        if (res.success && res.data) {
          setItems(res.data.rows || []);
          setTotalCount(res.data.total || 0);
        } else {
          throw new Error("Failed to load or empty");
        }
      } catch {
        setItems([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [
    keyword,
    diseaseFilter,
    feedbackStatusFilter,
    timeFilter,
    sortFilter,
    page,
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="mx-auto max-w-[1200px] pb-6">
      <PageHeader
        title="Lịch sử chẩn đoán"
        description="Tất cả kết quả chẩn đoán và phác đồ điều trị của bạn"
      />

      <HistoryFilterBar
        keyword={keyword}
        setKeyword={(val) => {
          setKeyword(val);
          setPage(1);
        }}
        diseaseFilter={diseaseFilter}
        setDiseaseFilter={(val) => {
          setDiseaseFilter(val);
          setPage(1);
        }}
        feedbackStatusFilter={feedbackStatusFilter}
        setFeedbackStatusFilter={(val) => {
          setFeedbackStatusFilter(val);
          setPage(1);
        }}
        timeFilter={timeFilter}
        setTimeFilter={(val) => {
          setTimeFilter(val);
          setPage(1);
        }}
        sortFilter={sortFilter}
        setSortFilter={(val) => {
          setSortFilter(val);
          setPage(1);
        }}
        totalCount={totalCount}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, idx) => (
            <div
              key={idx}
              className="border-border bg-bg-card overflow-hidden rounded-2xl border p-3"
            >
              <Skeleton className="mb-3 aspect-video w-full rounded-xl sm:aspect-square" />
              <Skeleton className="mb-2 h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<History className="h-6 w-6" />}
          title="Không tìm thấy kết quả nào"
          description="Vui lòng thử thay đổi điều kiện lọc hoặc bắt đầu chẩn đoán ảnh mới."
          action={
            <Link
              href={ROUTES.DIAGNOSE}
              className="bg-primary hover:bg-primary-hover inline-flex min-h-11 items-center rounded-xl px-5 text-sm font-semibold text-white transition-colors"
            >
              Chẩn đoán ngay
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border-border bg-bg-card text-text-primary hover:bg-bg-hover min-h-11 cursor-pointer rounded-xl border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trang trước
              </button>
              <span className="text-text-secondary px-2 text-sm tabular-nums">
                Trang {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="border-border bg-bg-card text-text-primary hover:bg-bg-hover min-h-11 cursor-pointer rounded-xl border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
