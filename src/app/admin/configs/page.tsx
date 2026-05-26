"use client";

import { Check, Edit2, Loader2, Plus, Search, X } from "lucide-react";
import { useState } from "react";

import { useAdminConfigs } from "@/hooks/useAdminConfigs";

export default function AdminConfigsPage() {
  const {
    configs = [],
    isLoading,
    addConfig,
    updateConfig,
  } = useAdminConfigs();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ key: "", value: "", description: "" });
  const [saving, setSaving] = useState(false);

  const filtered = configs.filter(
    (c) =>
      c.key.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (c: any) => {
    setEditing(c);
    setForm({ key: c.key, value: c.value, description: c.description || "" });
    setShowModal(true);
  };
  const handleAdd = () => {
    setEditing(null);
    setForm({ key: "", value: "", description: "" });
    setShowModal(true);
  };
  const handleSave = async () => {
    if (!form.key || !form.value) return;
    setSaving(true);
    try {
      if (editing) {
        await updateConfig({
          key: editing.key,
          payload: { value: form.value, description: form.description },
        });
      } else {
        await addConfig({
          key: form.key,
          value: form.value,
          description: form.description,
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            Cấu hình hệ thống
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            Quản lý tham số hoạt động và cấu hình AI
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E]"
        >
          <Plus className="h-4 w-4" /> Thêm cấu hình
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-[400px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm cấu hình..."
            className="h-10 w-full rounded-lg border border-[#E0E0E0] pr-4 pl-10 text-[14px] focus:border-[#2F9E44] focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-[#E0E0E0] bg-white">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#2F9E44]" />
            <p className="text-[14px] text-[#5C5C5C]">
              Đang tải dữ liệu cấu hình...
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E0E0E0] bg-[#F7F7F7]">
                <th className="px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                  Từ khóa (Key)
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                  Giá trị (Value)
                </th>
                <th className="hidden px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                  Mô tả
                </th>
                <th className="hidden px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B] lg:table-cell">
                  Cập nhật cuối
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-[14px] text-[#5C5C5C]"
                  >
                    Không tìm thấy cấu hình nào
                  </td>
                </tr>
              ) : (
                filtered.map((c: any, i: number) => {
                  const isActive = c.isActive !== false;
                  const lastUpdated = c.updatedAt
                    ? new Date(c.updatedAt).toLocaleString("vi-VN")
                    : c.updated_at || "—";
                  return (
                    <tr
                      key={c.id || c.key}
                      className={`border-b border-[#E0E0E0] hover:bg-[#F7F7F7] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${isActive ? "bg-[#2F9E44]" : "bg-[#E0E0E0]"}`}
                          />
                          <span className="text-[12px] text-[#5C5C5C]">
                            {isActive ? "Đang chạy" : "Tắt"}
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
                          {c.description || "—"}
                        </span>
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <span className="text-[12px] text-[#5C5C5C]">
                          {lastUpdated}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(c)}
                          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[#E0E0E0] px-3 text-[13px] text-[#2F9E44] hover:bg-[#E6F4EA]"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Sửa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[500px] rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
                {editing ? "Sửa cấu hình" : "Thêm cấu hình mới"}
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
                  Từ khóa cấu hình (Config Key)
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
                  Giá trị (Value)
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
                  Mô tả (Description)
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
                disabled={saving}
                onClick={() => setShowModal(false)}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5]"
              >
                Hủy
              </button>
              <button
                disabled={saving}
                onClick={handleSave}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white hover:bg-[#1F6F2E]"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
