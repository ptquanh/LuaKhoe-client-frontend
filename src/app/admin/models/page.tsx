"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

interface AIModel { id: number; version: string; accuracy: number; samples: number; updatedAt: string; active: boolean; }

const mockModels: AIModel[] = [
  { id: 1, version: "v3.2.1", accuracy: 94.2, samples: 15231, updatedAt: "10/03/2026", active: true },
  { id: 2, version: "v3.1.0", accuracy: 92.8, samples: 12400, updatedAt: "15/02/2026", active: false },
  { id: 3, version: "v3.0.0", accuracy: 91.5, samples: 10800, updatedAt: "01/01/2026", active: false },
  { id: 4, version: "v2.5.2", accuracy: 89.3, samples: 8200, updatedAt: "15/11/2025", active: false },
  { id: 5, version: "v2.0.0", accuracy: 85.1, samples: 5600, updatedAt: "01/08/2025", active: false },
];

export default function AdminModelsPage() {
  const [models, setModels] = useState(mockModels);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ version: "", notes: "" });

  const toggleActive = (id: number) => setModels(prev => prev.map(m => ({ ...m, active: m.id === id })));
  const handleUpload = () => { if (!form.version.trim()) return; setModels(prev => [{ id: Date.now(), version: form.version, accuracy: 0, samples: 0, updatedAt: new Date().toLocaleDateString("vi"), active: false }, ...prev]); setShowUpload(false); setForm({ version: "", notes: "" }); };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[28px] font-[700] text-[#1B1B1B]">Quản lý AI Models</h1><p className="text-[14px] text-[#5C5C5C] mt-1">{models.length} phiên bản</p></div>
        <button onClick={() => setShowUpload(true)} className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] hover:bg-[#1F6F2E] flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" /> Upload Model</button>
      </div>

      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F0F2F5]">
            <th className="text-left px-4 h-12 text-[13px] font-[600] text-[#1B1B1B]">Version</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B]">Accuracy</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell">Samples</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell">Updated</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] w-24">Active</th>
          </tr></thead>
          <tbody>
            {models.map((m, i) => (
              <tr key={m.id} className={`border-t border-[#E0E0E0] h-12 hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}>
                <td className="px-4 text-[14px] font-[500] text-[#1B1B1B]">{m.version}{m.active && <span className="ml-2 text-[11px] bg-[#E6F4EA] text-[#2E7D32] px-1.5 py-0.5 rounded">Active</span>}</td>
                <td className="px-4 text-center"><span className={`text-[14px] font-[500] ${m.accuracy >= 90 ? "text-[#2E7D32]" : m.accuracy >= 85 ? "text-[#FB8C00]" : "text-[#E53935]"}`}>{m.accuracy > 0 ? `${m.accuracy}%` : "—"}</span></td>
                <td className="px-4 text-[14px] text-[#5C5C5C] text-center hidden md:table-cell">{m.samples.toLocaleString()}</td>
                <td className="px-4 text-[14px] text-[#5C5C5C] text-center hidden md:table-cell">{m.updatedAt}</td>
                <td className="px-4 text-center">
                  <button onClick={() => toggleActive(m.id)} className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${m.active ? "bg-[#2F9E44]" : "bg-[#E0E0E0]"}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${m.active ? "left-5" : "left-1"}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl max-w-[500px] w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-[600] text-[#1B1B1B]">Upload Model mới</h3>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 rounded-md hover:bg-[#F0F2F5] flex items-center justify-center cursor-pointer"><X className="w-5 h-5 text-[#5C5C5C]" /></button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg p-6 text-center hover:border-[#2F9E44] cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-[#5C5C5C] mx-auto mb-2" />
                <p className="text-[14px] text-[#5C5C5C]">Kéo thả hoặc chọn file model</p>
                <p className="text-[12px] text-[#9E9E9E] mt-1">Hỗ trợ .h5, .onnx, .pt</p>
              </div>
              <div><label className="block text-[14px] text-[#1B1B1B] mb-1.5">Version</label><input type="text" value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} placeholder="v3.3.0" className="w-full h-10 px-3 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44]" /></div>
              <div><label className="block text-[14px] text-[#1B1B1B] mb-1.5">Release Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Mô tả thay đổi..." className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44] resize-none" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUpload(false)} className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5] cursor-pointer">Hủy</button>
              <button onClick={handleUpload} className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] hover:bg-[#1F6F2E] flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" /> Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
