"use client";

import { useState } from "react";
import { Filter, Calendar } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useRouter } from "next/navigation";

const img1 =
  "https://images.unsplash.com/photo-1634641568774-1906553ade90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGxhbnQlMjBkaXNlYXNlJTIwbGVhZiUyMGJyb3duJTIwc3BvdHxlbnwxfHx8fDE3NzMzNzA3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080";
const img2 =
  "https://images.unsplash.com/photo-1658315216731-d0548fd66f25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwbGVhZiUyMGNsb3NlJTIwdXAlMjBncmVlbiUyMGhlYWx0aHl8ZW58MXx8fHwxNzczMzcwNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080";
const img3 =
  "https://images.unsplash.com/photo-1761549849552-f24b1979aab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGxhbnQlMjBwZXN0JTIwZGFtYWdlJTIweWVsbG93fGVufDF8fHx8MTc3MzM3MDcxNHww&ixlib=rb-4.1.0&q=80&w=1080";

const mockHistory = [
  {
    id: 1,
    img: img1,
    disease: "Bệnh đạo ôn",
    severity: "high",
    date: "12/03/2026",
    confidence: 92,
  },
  {
    id: 2,
    img: img2,
    disease: "Khỏe mạnh",
    severity: "low",
    date: "10/03/2026",
    confidence: 98,
  },
  {
    id: 3,
    img: img3,
    disease: "Bệnh bạc lá",
    severity: "medium",
    date: "08/03/2026",
    confidence: 87,
  },
  {
    id: 4,
    img: img1,
    disease: "Bệnh khô vằn",
    severity: "critical",
    date: "05/03/2026",
    confidence: 85,
  },
  {
    id: 5,
    img: img2,
    disease: "Khỏe mạnh",
    severity: "low",
    date: "02/03/2026",
    confidence: 96,
  },
  {
    id: 6,
    img: img3,
    disease: "Bệnh đốm nâu",
    severity: "medium",
    date: "28/02/2026",
    confidence: 89,
  },
  {
    id: 7,
    img: img1,
    disease: "Bệnh đạo ôn",
    severity: "high",
    date: "25/02/2026",
    confidence: 91,
  },
  {
    id: 8,
    img: img2,
    disease: "Khỏe mạnh",
    severity: "low",
    date: "22/02/2026",
    confidence: 97,
  },
];

const sevColors: Record<string, { bg: string; text: string }> = {
  low: { bg: "#E6F4EA", text: "#2E7D32" },
  medium: { bg: "#FFF8E1", text: "#F57F17" },
  high: { bg: "#FFF3E0", text: "#E65100" },
  critical: { bg: "#FFEBEE", text: "#C62828" },
};

const diseases = [
  "Tất cả",
  "Bệnh đạo ôn",
  "Bệnh bạc lá",
  "Bệnh khô vằn",
  "Bệnh đốm nâu",
  "Khỏe mạnh",
];
const times = ["Tất cả", "7 ngày qua", "30 ngày qua", "3 tháng qua"];

export default function DiagnosisHistoryPage() {
  const router = useRouter();
  const [diseaseFilter, setDiseaseFilter] = useState("Tất cả");
  const [timeFilter, setTimeFilter] = useState("Tất cả");

  const filtered = mockHistory.filter((h) => {
    if (diseaseFilter !== "Tất cả" && h.disease !== diseaseFilter) return false;
    return true;
  });

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

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#5C5C5C]" />
          <select
            value={diseaseFilter}
            onChange={(e) => setDiseaseFilter(e.target.value)}
            className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-3 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
          >
            {diseases.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#5C5C5C]" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-3 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
          >
            {times.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <span className="ml-auto text-[14px] text-[#5C5C5C]">
          {filtered.length} kết quả
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item) => {
          const sc = sevColors[item.severity];
          return (
            <div
              key={item.id}
              onClick={() => router.push(`/diagnose`)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-[#E0E0E0] bg-white transition-all hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-[#F7F7F7]">
                <ImageWithFallback
                  src={item.img}
                  alt={item.disease}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <span
                    className="inline-block rounded px-2 py-0.5 text-[11px] font-[600]"
                    style={{ backgroundColor: sc.bg, color: sc.text }}
                  >
                    {item.disease}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#5C5C5C]">
                    {item.date}
                  </span>
                  <span className="text-[12px] font-[600] text-[#2F9E44]">
                    Độ tin cậy: {item.confidence}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
