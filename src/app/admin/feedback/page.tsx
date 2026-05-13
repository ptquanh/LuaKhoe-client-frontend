"use client";

import { useState } from "react";
import { Search, ThumbsUp, ThumbsDown, Flag, Filter } from "lucide-react";

interface Feedback { id: number; farmer: string; disease: string; rating: "positive" | "negative"; comment: string; date: string; flagged: boolean; }

const mockFeedback: Feedback[] = [
  { id: 1, farmer: "Nguyễn Văn A", disease: "Bệnh đạo ôn", rating: "positive", comment: "Chẩn đoán chính xác, phác đồ chi tiết.", date: "22/04/2026", flagged: false },
  { id: 2, farmer: "Trần Thị B", disease: "Bệnh bạc lá", rating: "negative", comment: "Nhầm bệnh bạc lá thành đạo ôn.", date: "21/04/2026", flagged: true },
  { id: 3, farmer: "Lê Văn C", disease: "Bệnh khô vằn", rating: "positive", comment: "Phát hiện sớm, cứu được ruộng.", date: "20/04/2026", flagged: false },
  { id: 4, farmer: "Phạm Thị D", disease: "Bệnh đốm nâu", rating: "negative", comment: "Phác đồ không phù hợp vùng ĐBSCL.", date: "19/04/2026", flagged: true },
  { id: 5, farmer: "Hoàng Văn E", disease: "Bệnh đạo ôn", rating: "positive", comment: "Nhanh, chính xác. Rất hài lòng.", date: "18/04/2026", flagged: false },
  { id: 6, farmer: "Vũ Thị F", disease: "Bệnh vàng lùn", rating: "negative", comment: "Độ tin cậy thấp, cần cải thiện.", date: "17/04/2026", flagged: false },
];

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(mockFeedback);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<"all" | "positive" | "negative">("all");

  const filtered = feedbacks.filter(f => {
    const matchSearch = f.farmer.toLowerCase().includes(search.toLowerCase()) || f.disease.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === "all" || f.rating === filterRating;
    return matchSearch && matchRating;
  });

  const toggleFlag = (id: number) => setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, flagged: !f.flagged } : f));
  const positiveCount = feedbacks.filter(f => f.rating === "positive").length;
  const negativeCount = feedbacks.filter(f => f.rating === "negative").length;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-[28px] font-[700] text-[#1B1B1B]">Phản hồi AI</h1>
        <p className="text-[14px] text-[#5C5C5C] mt-1">Quản lý phản hồi từ nông dân về kết quả chẩn đoán</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 text-center"><p className="text-[24px] font-[700] text-[#1B1B1B]">{feedbacks.length}</p><p className="text-[13px] text-[#5C5C5C]">Tổng phản hồi</p></div>
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 text-center"><p className="text-[24px] font-[700] text-[#2E7D32]">{positiveCount}</p><p className="text-[13px] text-[#5C5C5C]">Tích cực</p></div>
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 text-center"><p className="text-[24px] font-[700] text-[#E53935]">{negativeCount}</p><p className="text-[13px] text-[#5C5C5C]">Tiêu cực</p></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44]" />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="w-4 h-4 text-[#5C5C5C] mr-1" />
          {(["all", "positive", "negative"] as const).map(r => (
            <button key={r} onClick={() => setFilterRating(r)} className={`h-8 px-3 rounded-lg text-[13px] font-[500] cursor-pointer transition-colors ${filterRating === r ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}>
              {r === "all" ? "Tất cả" : r === "positive" ? "Tích cực" : "Tiêu cực"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(f => (
          <div key={f.id} className={`bg-white rounded-xl border p-4 transition-colors ${f.flagged ? "border-[#FB8C00] bg-[#FFF8E1]" : "border-[#E0E0E0]"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {f.rating === "positive" ? <ThumbsUp className="w-4 h-4 text-[#2E7D32]" /> : <ThumbsDown className="w-4 h-4 text-[#E53935]" />}
                  <span className="text-[14px] font-[500] text-[#1B1B1B]">{f.farmer}</span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[12px] text-[#5C5C5C]">{f.disease}</span>
                  <span className="text-[12px] text-[#9E9E9E]">·</span>
                  <span className="text-[12px] text-[#9E9E9E]">{f.date}</span>
                </div>
                <p className="text-[14px] text-[#5C5C5C] leading-[1.5]">{f.comment}</p>
              </div>
              <button onClick={() => toggleFlag(f.id)} className={`h-8 px-2.5 rounded-md text-[12px] font-[500] flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${f.flagged ? "bg-[#FB8C00] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#FFF3E0]"}`}>
                <Flag className="w-3.5 h-3.5" />
                {f.flagged ? "Flagged" : "Flag"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
