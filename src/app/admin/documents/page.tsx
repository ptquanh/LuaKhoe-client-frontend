"use client";

import { useState } from "react";
import { Upload, FileText, Trash2, CheckCircle, Clock, AlertCircle, X } from "lucide-react";

interface Doc { id: number; name: string; size: string; type: string; status: "processed" | "processing" | "error"; uploadedAt: string; chunks: number; }

const mockDocs: Doc[] = [
  { id: 1, name: "rice_blast_guide_2025.pdf", size: "2.4 MB", type: "PDF", status: "processed", uploadedAt: "20/04/2026", chunks: 45 },
  { id: 2, name: "bacterial_blight_treatment.pdf", size: "1.8 MB", type: "PDF", status: "processed", uploadedAt: "18/04/2026", chunks: 32 },
  { id: 3, name: "irri_disease_manual.pdf", size: "5.2 MB", type: "PDF", status: "processing", uploadedAt: "22/04/2026", chunks: 0 },
  { id: 4, name: "sheath_blight_research.docx", size: "890 KB", type: "DOCX", status: "processed", uploadedAt: "15/04/2026", chunks: 18 },
  { id: 5, name: "pest_management_vn.pdf", size: "3.1 MB", type: "PDF", status: "error", uploadedAt: "21/04/2026", chunks: 0 },
];

const statusConfig = {
  processed: { icon: CheckCircle, label: "Đã xử lý", bg: "bg-[#E6F4EA]", text: "text-[#2E7D32]" },
  processing: { icon: Clock, label: "Đang xử lý", bg: "bg-[#FFF3E0]", text: "text-[#E65100]" },
  error: { icon: AlertCircle, label: "Lỗi", bg: "bg-[#FFEBEE]", text: "text-[#C62828]" },
};

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState(mockDocs);
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const totalChunks = docs.reduce((sum, d) => sum + d.chunks, 0);
  const handleDelete = (id: number) => setDocs(prev => prev.filter(d => d.id !== id));

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">Tài liệu RAG</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">{docs.length} tài liệu · {totalChunks} chunks</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] font-[500] hover:bg-[#1F6F2E] flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" /> Upload tài liệu</button>
      </div>

      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F0F2F5]">
            <th className="text-left px-4 h-12 text-[13px] font-[600] text-[#1B1B1B]">Tên file</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell w-20">Loại</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell w-20">Kích thước</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] w-28">Trạng thái</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell w-20">Chunks</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] w-20">Xóa</th>
          </tr></thead>
          <tbody>
            {docs.map((d, i) => {
              const sc = statusConfig[d.status];
              const Icon = sc.icon;
              return (
                <tr key={d.id} className={`border-t border-[#E0E0E0] h-12 hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}>
                  <td className="px-4"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#5C5C5C] shrink-0" /><span className="text-[14px] font-[500] text-[#1B1B1B] truncate">{d.name}</span></div></td>
                  <td className="px-4 text-center hidden md:table-cell"><span className="text-[12px] bg-[#F0F2F5] px-2 py-0.5 rounded font-[500] text-[#5C5C5C]">{d.type}</span></td>
                  <td className="px-4 text-[13px] text-[#5C5C5C] text-center hidden md:table-cell">{d.size}</td>
                  <td className="px-4 text-center"><span className={`inline-flex items-center gap-1 h-5 px-2 rounded text-[11px] font-[500] leading-[20px] ${sc.bg} ${sc.text}`}><Icon className="w-3 h-3" />{sc.label}</span></td>
                  <td className="px-4 text-[13px] text-[#1B1B1B] text-center hidden md:table-cell font-[500]">{d.chunks || "—"}</td>
                  <td className="px-4 text-center"><button onClick={() => handleDelete(d.id)} className="h-8 w-8 rounded-md hover:bg-[#FFEBEE] flex items-center justify-center cursor-pointer text-[#E53935] mx-auto"><Trash2 className="w-3.5 h-3.5" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl max-w-[500px] w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">Upload tài liệu</h3>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center cursor-pointer"><X className="w-5 h-5 text-[#5C5C5C]" /></button>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); }}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-[#2F9E44] bg-[#E6F4EA]/30" : "border-[#E0E0E0] hover:border-[#2F9E44]"}`}
            >
              <Upload className="w-10 h-10 text-[#5C5C5C] mx-auto mb-3" />
              <p className="text-[14px] text-[#5C5C5C]">Kéo thả hoặc click để chọn file</p>
              <p className="text-[12px] text-[#9E9E9E] mt-1">Hỗ trợ PDF, DOCX, TXT (tối đa 20MB)</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUpload(false)} className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5] cursor-pointer">Hủy</button>
              <button className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] hover:bg-[#1F6F2E] flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" /> Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
