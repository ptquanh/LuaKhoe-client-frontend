"use client";

import { Check, Edit2, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";

interface Disease {
  id: number;
  name: string;
  nameEn: string;
  symptoms: string;
  severity: string;
  treatment: string;
}

const mockDiseases: Disease[] = [
  {
    id: 1,
    name: "Bệnh đạo ôn",
    nameEn: "Rice Blast",
    symptoms: "Đốm hình mắt, viền nâu, tâm xám",
    severity: "high",
    treatment: "Tricyclazole 75WP, Isoprothiolane",
  },
  {
    id: 2,
    name: "Bệnh bạc lá",
    nameEn: "Bacterial Leaf Blight",
    symptoms: "Lá héo từ mép, vàng dần",
    severity: "high",
    treatment: "Bismerthiazol, Copper Hydroxide",
  },
  {
    id: 3,
    name: "Bệnh khô vằn",
    nameEn: "Sheath Blight",
    symptoms: "Vết bệnh hình bầu dục trên bẹ lá",
    severity: "medium",
    treatment: "Validamycin, Hexaconazole",
  },
  {
    id: 4,
    name: "Bệnh đốm nâu",
    nameEn: "Brown Spot",
    symptoms: "Đốm tròn nâu trên lá",
    severity: "low",
    treatment: "Mancozeb, Propiconazole",
  },
  {
    id: 5,
    name: "Bệnh vàng lùn",
    nameEn: "Rice Grassy Stunt",
    symptoms: "Cây lùn, lá vàng nhạt",
    severity: "high",
    treatment: "Diệt rầy nâu, giống kháng",
  },
];

const severityMap: Record<string, { label: string; bg: string; text: string }> =
  {
    high: { label: "Nghiêm trọng", bg: "bg-[#FFEBEE]", text: "text-[#C62828]" },
    medium: { label: "Trung bình", bg: "bg-[#FFF3E0]", text: "text-[#E65100]" },
    low: { label: "Nhẹ", bg: "bg-[#E6F4EA]", text: "text-[#2E7D32]" },
  };

export default function AdminDiseasesPage() {
  const [diseases, setDiseases] = useState(mockDiseases);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Disease | null>(null);
  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    symptoms: "",
    severity: "medium",
    treatment: "",
  });

  const filtered = diseases.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.nameEn.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (d: Disease) => {
    setEditing(d);
    setForm({
      name: d.name,
      nameEn: d.nameEn,
      symptoms: d.symptoms,
      severity: d.severity,
      treatment: d.treatment,
    });
    setShowModal(true);
  };
  const handleAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      nameEn: "",
      symptoms: "",
      severity: "medium",
      treatment: "",
    });
    setShowModal(true);
  };
  const handleSave = () => {
    if (editing) {
      setDiseases((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...form } : d)),
      );
    } else {
      setDiseases((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: number) =>
    setDiseases((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            Quản lý Bệnh lúa
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            {diseases.length} loại bệnh
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm bệnh..."
              className="h-10 w-[220px] rounded-lg border border-[#E0E0E0] pr-4 pl-10 text-[14px] focus:border-[#2F9E44] focus:outline-none"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E]"
          >
            <Plus className="h-4 w-4" /> Thêm bệnh
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F2F5]">
              <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Tên bệnh
              </th>
              <th className="hidden h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Tên tiếng Anh
              </th>
              <th className="h-12 w-28 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Mức độ
              </th>
              <th className="hidden h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B] lg:table-cell">
                Triệu chứng
              </th>
              <th className="h-12 w-28 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => {
              const sev = severityMap[d.severity];
              return (
                <tr
                  key={d.id}
                  className={`h-12 border-t border-[#E0E0E0] hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
                >
                  <td className="px-4 text-[14px] font-[500] text-[#1B1B1B]">
                    {d.name}
                  </td>
                  <td className="hidden px-4 text-[14px] text-[#5C5C5C] md:table-cell">
                    {d.nameEn}
                  </td>
                  <td className="px-4 text-center">
                    <span
                      className={`inline-block h-5 rounded px-2 text-[11px] leading-[20px] font-[500] ${sev.bg} ${sev.text}`}
                    >
                      {sev.label}
                    </span>
                  </td>
                  <td className="hidden max-w-[250px] truncate px-4 text-[13px] text-[#5C5C5C] lg:table-cell">
                    {d.symptoms}
                  </td>
                  <td className="px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(d)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#2F9E44] hover:bg-[#E6F4EA]"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#E53935] hover:bg-[#FFEBEE]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[520px] rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
                {editing ? "Sửa bệnh" : "Thêm bệnh mới"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-[#F0F2F5]"
              >
                <X className="h-5 w-5 text-[#5C5C5C]" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-[14px] font-[500] text-[#1B1B1B]">
                  Tên bệnh (Tiếng Việt)
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[14px] font-[500] text-[#1B1B1B]">
                  Tên tiếng Anh
                </label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[14px] font-[500] text-[#1B1B1B]">
                  Mức độ
                </label>
                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm({ ...form, severity: e.target.value })
                  }
                  className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                >
                  <option value="low">Nhẹ</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Nghiêm trọng</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[14px] font-[500] text-[#1B1B1B]">
                  Triệu chứng
                </label>
                <textarea
                  value={form.symptoms}
                  onChange={(e) =>
                    setForm({ ...form, symptoms: e.target.value })
                  }
                  rows={2}
                  className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[14px] font-[500] text-[#1B1B1B]">
                  Điều trị
                </label>
                <textarea
                  value={form.treatment}
                  onChange={(e) =>
                    setForm({ ...form, treatment: e.target.value })
                  }
                  rows={2}
                  className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#E0E0E0] px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5]"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E]"
              >
                <Check className="h-4 w-4" /> Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
