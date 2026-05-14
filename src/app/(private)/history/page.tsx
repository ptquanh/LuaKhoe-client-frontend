"use client";

import React, { useState, useEffect } from "react";
import { HistoryFilterBar } from "./components/HistoryFilterBar";
import { HistoryCard } from "./components/HistoryCard";
import { diagnosisService } from "@/services/diagnosis.service";
import { DiagnosisResponse } from "@/types/diagnose.type";
import { Loader2 } from "lucide-react";

const img1 =
  "https://images.unsplash.com/photo-1634641568774-1906553ade90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGxhbnQlMjBkaXNlYXNlJTIwbGVhZiUyMGJyb3duJTIwc3BvdHxlbnwxfHx8fDE3NzMzNzA3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080";
const img2 =
  "https://images.unsplash.com/photo-1658315216731-d0548fd66f25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwbGVhZiUyMGNsb3NlJTIwdXAlMjBncmVlbiUyMGhlYWx0aHl8ZW58MXx8fHwxNzczMzcwNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080";
const img3 =
  "https://images.unsplash.com/photo-1761549849552-f24b1979aab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGxhbnQlMjBwZXN0JTIwZGFtYWdlJTIweWVsbG93fGVufDF8fHx8MTc3MzM3MDcxNHww&ixlib=rb-4.1.0&q=80&w=1080";

const mockDiagnosisResponses: DiagnosisResponse[] = [
  {
    id: "mock-1",
    userId: "user-1",
    originalImageUrl: img1,
    resultImageUrl: img1,
    gpsLat: null,
    gpsLng: null,
    weatherData: null,
    envDescription: "Lúa bị đốm nâu trên lá",
    modelVersionId: "v1",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    results: [
      {
        id: "res-1",
        diagnosisId: "mock-1",
        diseaseId: "dis-1",
        disease: { id: "dis-1", name: "Bệnh đạo ôn", status: "active" },
        confidence: 0.92,
      },
    ],
  },
  {
    id: "mock-2",
    userId: "user-1",
    originalImageUrl: img2,
    resultImageUrl: img2,
    gpsLat: null,
    gpsLng: null,
    weatherData: null,
    envDescription: "Cây lúa phát triển bình thường",
    modelVersionId: "v1",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    results: [
      {
        id: "res-2",
        diagnosisId: "mock-2",
        diseaseId: "dis-2",
        disease: { id: "dis-2", name: "Khỏe mạnh", status: "active" },
        confidence: 0.98,
      },
    ],
  },
  {
    id: "mock-3",
    userId: "user-1",
    originalImageUrl: img3,
    resultImageUrl: img3,
    gpsLat: null,
    gpsLng: null,
    weatherData: null,
    envDescription: "Xuất hiện vệt trắng dài trên lá",
    modelVersionId: "v1",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    results: [
      {
        id: "res-3",
        diagnosisId: "mock-3",
        diseaseId: "dis-3",
        disease: { id: "dis-3", name: "Bệnh bạc lá", status: "active" },
        confidence: 0.87,
      },
    ],
  },
  {
    id: "mock-4",
    userId: "user-1",
    originalImageUrl: img1,
    resultImageUrl: img1,
    gpsLat: null,
    gpsLng: null,
    weatherData: null,
    envDescription: "Bị khô vằn ở thân",
    modelVersionId: "v1",
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    results: [
      {
        id: "res-4",
        diagnosisId: "mock-4",
        diseaseId: "dis-4",
        disease: { id: "dis-4", name: "Bệnh khô vằn", status: "active" },
        confidence: 0.85,
      },
    ],
  },
];

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
  const [isUsingMock, setIsUsingMock] = useState<boolean>(false);

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
          setIsUsingMock(false);
        } else {
          throw new Error("Failed to load or empty");
        }
      } catch (err) {
        // Fallback to mock data filtering
        const filtered = mockDiagnosisResponses.filter((m) => {
          if (diseaseFilter !== "Tất cả") {
            const dName = m.results?.[0]?.disease?.name;
            if (dName !== diseaseFilter) return false;
          }
          if (keyword) {
            const kw = keyword.toLowerCase();
            const dName = m.results?.[0]?.disease?.name?.toLowerCase() || "";
            const desc = m.envDescription?.toLowerCase() || "";
            if (!dName.includes(kw) && !desc.includes(kw)) return false;
          }
          return true;
        });

        setItems(filtered);
        setTotalCount(filtered.length);
        setIsUsingMock(true);
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
          Tất cả kết quả chẩn đoán của bạn {isUsingMock && "(Dữ liệu mẫu)"}
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
