"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

interface AIModel {
  id: number;
  version: string;
  accuracy: number;
  samples: number;
  updatedAt: string;
  active: boolean;
}

const mockModels: AIModel[] = [
  {
    id: 1,
    version: "v3.2.1",
    accuracy: 94.2,
    samples: 15231,
    updatedAt: "10/03/2026",
    active: true,
  },
  {
    id: 2,
    version: "v3.1.0",
    accuracy: 92.8,
    samples: 12400,
    updatedAt: "15/02/2026",
    active: false,
  },
  {
    id: 3,
    version: "v3.0.0",
    accuracy: 91.5,
    samples: 10800,
    updatedAt: "01/01/2026",
    active: false,
  },
  {
    id: 4,
    version: "v2.5.2",
    accuracy: 89.3,
    samples: 8200,
    updatedAt: "15/11/2025",
    active: false,
  },
  {
    id: 5,
    version: "v2.0.0",
    accuracy: 85.1,
    samples: 5600,
    updatedAt: "01/08/2025",
    active: false,
  },
];

export default function AdminModelsPage() {
  const [models, setModels] = useState(mockModels);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ version: "", notes: "" });

  const toggleActive = (id: number) =>
    setModels((prev) => prev.map((m) => ({ ...m, active: m.id === id })));
  const handleUpload = () => {
    if (!form.version.trim()) return;
    setModels((prev) => [
      {
        id: Date.now(),
        version: form.version,
        accuracy: 0,
        samples: 0,
        updatedAt: new Date().toLocaleDateString("vi"),
        active: false,
      },
      ...prev,
    ]);
    setShowUpload(false);
    setForm({ version: "", notes: "" });
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            Quản lý AI Models
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            {models.length} phiên bản
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] text-white hover:bg-[#1F6F2E]"
        >
          <Upload className="h-4 w-4" /> Upload Model
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F2F5]">
              <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Version
              </th>
              <th className="h-12 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Accuracy
              </th>
              <th className="hidden h-12 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Samples
              </th>
              <th className="hidden h-12 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Updated
              </th>
              <th className="h-12 w-24 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Active
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => (
              <tr
                key={m.id}
                className={`h-12 border-t border-[#E0E0E0] hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
              >
                <td className="px-4 text-[14px] font-[500] text-[#1B1B1B]">
                  {m.version}
                  {m.active && (
                    <span className="ml-2 rounded bg-[#E6F4EA] px-1.5 py-0.5 text-[11px] text-[#2E7D32]">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 text-center">
                  <span
                    className={`text-[14px] font-[500] ${m.accuracy >= 90 ? "text-[#2E7D32]" : m.accuracy >= 85 ? "text-[#FB8C00]" : "text-[#E53935]"}`}
                  >
                    {m.accuracy > 0 ? `${m.accuracy}%` : "—"}
                  </span>
                </td>
                <td className="hidden px-4 text-center text-[14px] text-[#5C5C5C] md:table-cell">
                  {m.samples.toLocaleString()}
                </td>
                <td className="hidden px-4 text-center text-[14px] text-[#5C5C5C] md:table-cell">
                  {m.updatedAt}
                </td>
                <td className="px-4 text-center">
                  <button
                    onClick={() => toggleActive(m.id)}
                    className={`relative h-6 w-10 cursor-pointer rounded-full transition-colors ${m.active ? "bg-[#2F9E44]" : "bg-[#E0E0E0]"}`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${m.active ? "left-5" : "left-1"}`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[500px] rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-[600] text-[#1B1B1B]">
                Upload Model mới
              </h3>
              <button
                onClick={() => setShowUpload(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-[#F0F2F5]"
              >
                <X className="h-5 w-5 text-[#5C5C5C]" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="cursor-pointer rounded-lg border-2 border-dashed border-[#E0E0E0] p-6 text-center transition-colors hover:border-[#2F9E44]">
                <Upload className="mx-auto mb-2 h-8 w-8 text-[#5C5C5C]" />
                <p className="text-[14px] text-[#5C5C5C]">
                  Kéo thả hoặc chọn file model
                </p>
                <p className="mt-1 text-[12px] text-[#9E9E9E]">
                  Hỗ trợ .h5, .onnx, .pt
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-[14px] text-[#1B1B1B]">
                  Version
                </label>
                <input
                  type="text"
                  value={form.version}
                  onChange={(e) =>
                    setForm({ ...form, version: e.target.value })
                  }
                  placeholder="v3.3.0"
                  className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[14px] text-[#1B1B1B]">
                  Release Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  placeholder="Mô tả thay đổi..."
                  className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUpload(false)}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5]"
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] text-white hover:bg-[#1F6F2E]"
              >
                <Upload className="h-4 w-4" /> Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
