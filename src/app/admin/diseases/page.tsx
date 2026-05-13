"use client";

import { useState } from "react";
import { Plus, Edit2, Search, X, Check, Trash2 } from "lucide-react";

interface Disease { id: number; name: string; nameEn: string; symptoms: string; severity: string; treatment: string; }

const mockDiseases: Disease[] = [
  { id: 1, name: "Bệnh đạo ôn", nameEn: "Rice Blast", symptoms: "Đốm hình mắt, viền nâu, tâm xám", severity: "high", treatment: "Tricyclazole 75WP, Isoprothiolane" },
  { id: 2, name: "Bệnh bạc lá", nameEn: "Bacterial Leaf Blight", symptoms: "Lá héo từ mép, vàng dần", severity: "high", treatment: "Bismerthiazol, Copper Hydroxide" },
  { id: 3, name: "Bệnh khô vằn", nameEn: "Sheath Blight", symptoms: "Vết bệnh hình bầu dục trên bẹ lá", severity: "medium", treatment: "Validamycin, Hexaconazole" },
  { id: 4, name: "Bệnh đốm nâu", nameEn: "Brown Spot", symptoms: "Đốm tròn nâu trên lá", severity: "low", treatment: "Mancozeb, Propiconazole" },
  { id: 5, name: "Bệnh vàng lùn", nameEn: "Rice Grassy Stunt", symptoms: "Cây lùn, lá vàng nhạt", severity: "high", treatment: "Diệt rầy nâu, giống kháng" },
];

const severityMap: Record<string, { label: string; bg: string; text: string }> = {
  high: { label: "Nghiêm trọng", bg: "bg-[#FFEBEE]", text: "text-[#C62828]" },
  medium: { label: "Trung bình", bg: "bg-[#FFF3E0]", text: "text-[#E65100]" },
  low: { label: "Nhẹ", bg: "bg-[#E6F4EA]", text: "text-[#2E7D32]" },
};

export default function AdminDiseasesPage() {
  const [diseases, setDiseases] = useState(mockDiseases);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Disease | null>(null);
  const [form, setForm] = useState({ name: "", nameEn: "", symptoms: "", severity: "medium", treatment: "" });

  const filtered = diseases.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.nameEn.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (d: Disease) => { setEditing(d); setForm({ name: d.name, nameEn: d.nameEn, symptoms: d.symptoms, severity: d.severity, treatment: d.treatment }); setShowModal(true); };
  const handleAdd = () => { setEditing(null); setForm({ name: "", nameEn: "", symptoms: "", severity: "medium", treatment: "" }); setShowModal(true); };
  const handleSave = () => {
    if (editing) { setDiseases(prev => prev.map(d => d.id === editing.id ? { ...d, ...form } : d)); }
    else { setDiseases(prev => [...prev, { id: Date.now(), ...form }]); }
    setShowModal(false);
  };
  const handleDelete = (id: number) => setDiseases(prev => prev.filter(d => d.id !== id));

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">Quản lý Bệnh lúa</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">{diseases.length} loại bệnh</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm bệnh..." className="h-10 pl-10 pr-4 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44] w-[220px]" />
          </div>
          <button onClick={handleAdd} className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] font-[500] hover:bg-[#1F6F2E] flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /> Thêm bệnh</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F0F2F5]">
            <th className="text-left px-4 h-12 text-[13px] font-[600] text-[#1B1B1B]">Tên bệnh</th>
            <th className="text-left px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell">Tên tiếng Anh</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] w-28">Mức độ</th>
            <th className="text-left px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden lg:table-cell">Triệu chứng</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] w-28">Thao tác</th>
          </tr></thead>
          <tbody>
            {filtered.map((d, i) => {
              const sev = severityMap[d.severity];
              return (
                <tr key={d.id} className={`border-t border-[#E0E0E0] h-12 hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}>
                  <td className="px-4 text-[14px] font-[500] text-[#1B1B1B]">{d.name}</td>
                  <td className="px-4 text-[14px] text-[#5C5C5C] hidden md:table-cell">{d.nameEn}</td>
                  <td className="px-4 text-center"><span className={`inline-block h-5 px-2 rounded text-[11px] font-[500] leading-[20px] ${sev.bg} ${sev.text}`}>{sev.label}</span></td>
                  <td className="px-4 text-[13px] text-[#5C5C5C] hidden lg:table-cell truncate max-w-[250px]">{d.symptoms}</td>
                  <td className="px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleEdit(d)} className="h-8 w-8 rounded-md hover:bg-[#E6F4EA] flex items-center justify-center cursor-pointer text-[#2F9E44]"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(d.id)} className="h-8 w-8 rounded-md hover:bg-[#FFEBEE] flex items-center justify-center cursor-pointer text-[#E53935]"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl max-w-[520px] w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">{editing ? "Sửa bệnh" : "Thêm bệnh mới"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center cursor-pointer"><X className="w-5 h-5 text-[#5C5C5C]" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><label className="text-[14px] font-[500] text-[#1B1B1B] mb-1.5 block">Tên bệnh (Tiếng Việt)</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44]" /></div>
              <div><label className="text-[14px] font-[500] text-[#1B1B1B] mb-1.5 block">Tên tiếng Anh</label><input type="text" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44]" /></div>
              <div><label className="text-[14px] font-[500] text-[#1B1B1B] mb-1.5 block">Mức độ</label>
                <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44]">
                  <option value="low">Nhẹ</option><option value="medium">Trung bình</option><option value="high">Nghiêm trọng</option>
                </select>
              </div>
              <div><label className="text-[14px] font-[500] text-[#1B1B1B] mb-1.5 block">Triệu chứng</label><textarea value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-[14px] resize-none focus:outline-none focus:border-[#2F9E44]" /></div>
              <div><label className="text-[14px] font-[500] text-[#1B1B1B] mb-1.5 block">Điều trị</label><textarea value={form.treatment} onChange={e => setForm({ ...form, treatment: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-[14px] resize-none focus:outline-none focus:border-[#2F9E44]" /></div>
            </div>
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5] cursor-pointer">Hủy</button>
              <button onClick={handleSave} className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] font-[500] hover:bg-[#1F6F2E] cursor-pointer flex items-center gap-2"><Check className="w-4 h-4" /> Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
