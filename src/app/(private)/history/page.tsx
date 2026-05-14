"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { diagnosisService } from "@/services/diagnosis.service";
import { DiagnosisResponse } from "@/types/diagnose.type";

import { HistoryCard } from "./components/HistoryCard";
import { HistoryFilterBar } from "./components/HistoryFilterBar";

export default function DiagnosisHistoryPage() {
  const [keyword, setKeyword] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("Tất cả");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const limit = 8;

  const [items, setItems] = useState<DiagnosisResponse[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [keyword, diseaseFilter, timeFilter, sortFilter]);

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

        const res = await diagnosisService.getHistory({
          limit,
          offset,
          keyword: keyword ? keyword : undefined,
          disease: diseaseFilter !== "Tất cả" ? diseaseFilter : undefined,
          fromDate,
          sort: sortFilter,
        });

        if (res.success && res.data) {
          setItems(res.data.rows || []);
          setTotalCount(res.data.total || 0);
        } else {
          throw new Error("Failed to load or empty");
        }
      } catch (err) {
        setItems([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [keyword, diseaseFilter, timeFilter, sortFilter, page]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="mx-auto max-w-[1200px] pb-20">
      <div className="mb-6">
        <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
          Lịch sử chẩn đoán
        </h1>
        <p className="mt-1 text-[14px] text-[#5C5C5C]">
          Tất cả kết quả chẩn đoán của bạn
        </p>
      </div>

      <HistoryFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        diseaseFilter={diseaseFilter}
        setDiseaseFilter={setDiseaseFilter}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        sortFilter={sortFilter}
        setSortFilter={setSortFilter}
        totalCount={totalCount}
      />

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#2F9E44]" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-[#E0E0E0] bg-white p-6 text-center">
          <p className="text-[16px] font-[600] text-[#1B1B1B]">
            Không tìm thấy kết quả nào
          </p>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            Vui lòng thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-[#E0E0E0] bg-white px-3 py-1.5 text-[14px] font-[600] text-[#1B1B1B] hover:bg-[#F7F7F7] disabled:opacity-50"
              >
                Trang trước
              </button>
              <span className="px-2 text-[14px] text-[#5C5C5C]">
                Trang {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-[#E0E0E0] bg-white px-3 py-1.5 text-[14px] font-[600] text-[#1B1B1B] hover:bg-[#F7F7F7] disabled:opacity-50"
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
