"use client";

import { useState } from "react";
import { Plus, Edit2, Search, Check, X } from "lucide-react";

interface Config {
  id: string;
  key: string;
  value: string;
  description: string;
  lastUpdated: string;
  isActive: boolean;
}

const mockConfigs: Config[] = [
  {
    id: "1",
    key: "AI_MODEL_VERSION",
    value: "v2.3.1",
    description: "Current AI model version for disease detection",
    lastUpdated: "2026-04-20 14:30",
    isActive: true,
  },
  {
    id: "2",
    key: "CONFIDENCE_THRESHOLD",
    value: "0.75",
    description: "Minimum confidence score to show predictions",
    lastUpdated: "2026-04-18 09:15",
    isActive: true,
  },
  {
    id: "3",
    key: "MAX_IMAGE_SIZE_MB",
    value: "10",
    description: "Maximum upload image size in megabytes",
    lastUpdated: "2026-04-15 11:45",
    isActive: true,
  },
  {
    id: "4",
    key: "RAG_CONTEXT_WINDOW",
    value: "5",
    description: "Number of knowledge base chunks to retrieve",
    lastUpdated: "2026-04-22 16:20",
    isActive: false,
  },
];

export default function AdminConfigsPage() {
  const [configs, setConfigs] = useState(mockConfigs);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Config | null>(null);
  const [form, setForm] = useState({ key: "", value: "", description: "" });

  const filtered = configs.filter(
    (c) =>
      c.key.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (c: Config) => {
    setEditing(c);
    setForm({ key: c.key, value: c.value, description: c.description });
    setShowModal(true);
  };
  const handleAdd = () => {
    setEditing(null);
    setForm({ key: "", value: "", description: "" });
    setShowModal(true);
  };
  const handleSave = () => {
    if (editing) {
      setConfigs((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, ...form, lastUpdated: new Date().toLocaleString() }
            : c,
        ),
      );
    } else {
      setConfigs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          ...form,
          lastUpdated: new Date().toLocaleString(),
          isActive: true,
        },
      ]);
    }
    setShowModal(false);
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            System Configuration
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            Manage system parameters and AI settings
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E]"
        >
          <Plus className="h-4 w-4" /> Add Config
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-[400px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search configs..."
            className="h-10 w-full rounded-lg border border-[#E0E0E0] pr-4 pl-10 text-[14px] focus:border-[#2F9E44] focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#F7F7F7]">
              <th className="px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Status
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Key
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Value
              </th>
              <th className="hidden px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Description
              </th>
              <th className="hidden px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B] lg:table-cell">
                Last Updated
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                className={`border-b border-[#E0E0E0] hover:bg-[#F7F7F7] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${c.isActive ? "bg-[#2F9E44]" : "bg-[#E0E0E0]"}`}
                    />
                    <span className="text-[12px] text-[#5C5C5C]">
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="rounded bg-[#F0F2F5] px-2 py-1 text-[13px] font-[600] text-[#1B1B1B]">
                    {c.key}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] font-[500] text-[#1B1B1B]">
                    {c.value}
                  </span>
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  <span className="text-[13px] text-[#5C5C5C]">
                    {c.description}
                  </span>
                </td>
                <td className="hidden px-6 py-4 lg:table-cell">
                  <span className="text-[12px] text-[#5C5C5C]">
                    {c.lastUpdated}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(c)}
                    className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[#E0E0E0] px-3 text-[13px] text-[#2F9E44] hover:bg-[#E6F4EA]"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[500px] rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
                {editing ? "Edit Config" : "Add New Config"}
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
                <label className="mb-2 block text-[14px] font-[500] text-[#1B1B1B]">
                  Config Key
                </label>
                <input
                  type="text"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  disabled={!!editing}
                  className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none disabled:bg-[#F7F7F7]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[14px] font-[500] text-[#1B1B1B]">
                  Value
                </label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-[14px] font-[500] text-[#1B1B1B]">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#E0E0E0] px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E]"
              >
                <Check className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
