"use client";

import { Activity, Users, Brain, FileText, TrendingUp, Image } from "lucide-react";

const stats = [
  { label: "Nông dân", value: "2,847", change: "+12%", icon: Users, color: "#2F9E44" },
  { label: "Ảnh phân tích", value: "15,231", change: "+8%", icon: Image, color: "#1976D2" },
  { label: "Độ chính xác AI", value: "94.2%", change: "+1.2%", icon: Brain, color: "#FB8C00" },
  { label: "Tài liệu RAG", value: "791", change: "+45", icon: FileText, color: "#E53935" },
];

const recentDiagnoses = [
  { id: 1, farmer: "Nguyễn Văn A", disease: "Bệnh đạo ôn", confidence: 96.5, time: "5 phút trước" },
  { id: 2, farmer: "Trần Thị B", disease: "Bệnh bạc lá", confidence: 91.2, time: "12 phút trước" },
  { id: 3, farmer: "Lê Văn C", disease: "Bệnh khô vằn", confidence: 88.7, time: "25 phút trước" },
  { id: 4, farmer: "Phạm Thị D", disease: "Bệnh đốm nâu", confidence: 93.1, time: "1 giờ trước" },
  { id: 5, farmer: "Hoàng Văn E", disease: "Bệnh đạo ôn", confidence: 97.3, time: "2 giờ trước" },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-[28px] font-[700] text-[#1B1B1B]">Dashboard</h1>
        <p className="text-[14px] text-[#5C5C5C] mt-1">Tổng quan hệ thống Lúa Khoẻ AI</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-[#E0E0E0] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + "1A" }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <span className="text-[12px] font-[500] text-[#2F9E44] bg-[#E6F4EA] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {s.change}
                </span>
              </div>
              <p className="text-[24px] font-[700] text-[#1B1B1B]">{s.value}</p>
              <p className="text-[13px] text-[#5C5C5C] mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* System Status + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
          <h2 className="text-[16px] font-[600] text-[#1B1B1B] mb-4">Trạng thái hệ thống</h2>
          <div className="space-y-3">
            {[
              { label: "API Server", status: "Online" },
              { label: "AI Model (ONNX)", status: "Active" },
              { label: "RAG Pipeline", status: "Active" },
              { label: "MongoDB", status: "Connected" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#F0F2F5] last:border-0">
                <span className="text-[14px] text-[#5C5C5C]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2F9E44]" />
                  <span className="text-[13px] font-[500] text-[#2F9E44]">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Diagnoses */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-[600] text-[#1B1B1B]">Chẩn đoán gần đây</h2>
            <Activity className="w-4 h-4 text-[#5C5C5C]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0E0E0]">
                  <th className="text-left py-3 text-[13px] font-[600] text-[#5C5C5C]">Nông dân</th>
                  <th className="text-left py-3 text-[13px] font-[600] text-[#5C5C5C]">Bệnh phát hiện</th>
                  <th className="text-center py-3 text-[13px] font-[600] text-[#5C5C5C]">Confidence</th>
                  <th className="text-right py-3 text-[13px] font-[600] text-[#5C5C5C]">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentDiagnoses.map((d) => (
                  <tr key={d.id} className="border-b border-[#F0F2F5] last:border-0 hover:bg-[#F7F7F7]">
                    <td className="py-3 text-[14px] font-[500] text-[#1B1B1B]">{d.farmer}</td>
                    <td className="py-3 text-[14px] text-[#5C5C5C]">{d.disease}</td>
                    <td className="py-3 text-center">
                      <span className={`text-[13px] font-[500] ${d.confidence >= 95 ? "text-[#2E7D32]" : d.confidence >= 90 ? "text-[#FB8C00]" : "text-[#E53935]"}`}>
                        {d.confidence}%
                      </span>
                    </td>
                    <td className="py-3 text-right text-[13px] text-[#9E9E9E]">{d.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
