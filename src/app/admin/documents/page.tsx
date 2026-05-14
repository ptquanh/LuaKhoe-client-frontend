"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";

interface Doc {
  id: number;
  name: string;
  size: string;
  type: string;
  status: "processed" | "processing" | "error";
  uploadedAt: string;
  chunks: number;
}

const mockDocs: Doc[] = [
  {
    id: 1,
    name: "rice_blast_guide_2025.pdf",
    size: "2.4 MB",
    type: "PDF",
    status: "processed",
    uploadedAt: "20/04/2026",
    chunks: 45,
  },
  {
    id: 2,
    name: "bacterial_blight_treatment.pdf",
    size: "1.8 MB",
    type: "PDF",
    status: "processed",
    uploadedAt: "18/04/2026",
    chunks: 32,
  },
  {
    id: 3,
    name: "irri_disease_manual.pdf",
    size: "5.2 MB",
    type: "PDF",
    status: "processing",
    uploadedAt: "22/04/2026",
    chunks: 0,
  },
  {
    id: 4,
    name: "sheath_blight_research.docx",
    size: "890 KB",
    type: "DOCX",
    status: "processed",
    uploadedAt: "15/04/2026",
    chunks: 18,
  },
  {
    id: 5,
    name: "pest_management_vn.pdf",
    size: "3.1 MB",
    type: "PDF",
    status: "error",
    uploadedAt: "21/04/2026",
    chunks: 0,
  },
];

const statusConfig = {
  processed: {
    icon: CheckCircle,
    label: "Đã xử lý",
    bg: "bg-[#E6F4EA]",
    text: "text-[#2E7D32]",
  },
  processing: {
    icon: Clock,
    label: "Đang xử lý",
    bg: "bg-[#FFF3E0]",
    text: "text-[#E65100]",
  },
  error: {
    icon: AlertCircle,
    label: "Lỗi",
    bg: "bg-[#FFEBEE]",
    text: "text-[#C62828]",
  },
};

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState(mockDocs);
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const totalChunks = docs.reduce((sum, d) => sum + d.chunks, 0);
  const handleDelete = (id: number) =>
    setDocs((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            Tài liệu RAG
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            {docs.length} tài liệu · {totalChunks} chunks
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E]"
        >
          <Upload className="h-4 w-4" /> Upload tài liệu
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F2F5]">
              <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Tên file
              </th>
              <th className="hidden h-12 w-20 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Loại
              </th>
              <th className="hidden h-12 w-20 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Kích thước
              </th>
              <th className="h-12 w-28 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Trạng thái
              </th>
              <th className="hidden h-12 w-20 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Chunks
              </th>
              <th className="h-12 w-20 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Xóa
              </th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d, i) => {
              const sc = statusConfig[d.status];
              const Icon = sc.icon;
              return (
                <tr
                  key={d.id}
                  className={`h-12 border-t border-[#E0E0E0] hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
                >
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-[#5C5C5C]" />
                      <span className="truncate text-[14px] font-[500] text-[#1B1B1B]">
                        {d.name}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 text-center md:table-cell">
                    <span className="rounded bg-[#F0F2F5] px-2 py-0.5 text-[12px] font-[500] text-[#5C5C5C]">
                      {d.type}
                    </span>
                  </td>
                  <td className="hidden px-4 text-center text-[13px] text-[#5C5C5C] md:table-cell">
                    {d.size}
                  </td>
                  <td className="px-4 text-center">
                    <span
                      className={`inline-flex h-5 items-center gap-1 rounded px-2 text-[11px] leading-[20px] font-[500] ${sc.bg} ${sc.text}`}
                    >
                      <Icon className="h-3 w-3" />
                      {sc.label}
                    </span>
                  </td>
                  <td className="hidden px-4 text-center text-[13px] font-[500] text-[#1B1B1B] md:table-cell">
                    {d.chunks || "—"}
                  </td>
                  <td className="px-4 text-center">
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#E53935] hover:bg-[#FFEBEE]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[500px] rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
                Upload tài liệu
              </h3>
              <button
                onClick={() => setShowUpload(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-[#F0F2F5]"
              >
                <X className="h-5 w-5 text-[#5C5C5C]" />
              </button>
            </div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${dragOver ? "border-[#2F9E44] bg-[#E6F4EA]/30" : "border-[#E0E0E0] hover:border-[#2F9E44]"}`}
            >
              <Upload className="mx-auto mb-3 h-10 w-10 text-[#5C5C5C]" />
              <p className="text-[14px] text-[#5C5C5C]">
                Kéo thả hoặc click để chọn file
              </p>
              <p className="mt-1 text-[12px] text-[#9E9E9E]">
                Hỗ trợ PDF, DOCX, TXT (tối đa 20MB)
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUpload(false)}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5]"
              >
                Hủy
              </button>
              <button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] text-white hover:bg-[#1F6F2E]">
                <Upload className="h-4 w-4" /> Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
