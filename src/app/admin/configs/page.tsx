"use client";

import { Check, Edit2, Loader2, Plus, Search, X } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
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
      <PageHeader
        title="Cấu hình hệ thống"
        description="Quản lý tham số hoạt động và cấu hình AI"
        actions={
          <button
            onClick={handleAdd}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            <Plus className="h-4 w-4" /> Thêm cấu hình
          </button>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-[400px]">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm cấu hình..."
            className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pr-4 pl-10 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Không tìm thấy cấu hình nào"
          description="Thử thay đổi từ khóa hoặc thêm cấu hình hệ thống mới."
        />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {filtered.map((c: any) => {
              const isActive = c.isActive !== false;
              const lastUpdated = c.updatedAt
                ? new Date(c.updatedAt).toLocaleString("vi-VN")
                : c.updated_at || "—";
              return (
                <div
                  key={c.id || c.key}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <code className="inline-block rounded bg-[var(--bg-subtle)] px-2 py-1 text-xs font-semibold break-all text-[var(--text-primary)]">
                        {c.key}
                      </code>
                      <p className="mt-2 text-sm font-semibold break-words text-[var(--text-primary)]">
                        {c.value}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isActive
                          ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                          : "bg-[var(--bg-subtle)] text-[var(--text-muted)]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[var(--primary)]" : "bg-[var(--text-muted)]"}`}
                      />
                      {isActive ? "Đang chạy" : "Tắt"}
                    </span>
                  </div>
                  {c.description && (
                    <p className="mt-2 text-xs text-[var(--text-secondary)]">
                      {c.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                    <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                      {lastUpdated}
                    </span>
                    <button
                      onClick={() => handleEdit(c)}
                      className="flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)]"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Sửa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Từ khóa (Key)
                  </th>
                  <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Giá trị (Value)
                  </th>
                  <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Mô tả
                  </th>
                  <th className="hidden px-6 py-4 text-left text-[13px] font-semibold text-[var(--text-primary)] lg:table-cell">
                    Cập nhật cuối
                  </th>
                  <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: any) => {
                  const isActive = c.isActive !== false;
                  const lastUpdated = c.updatedAt
                    ? new Date(c.updatedAt).toLocaleString("vi-VN")
                    : c.updated_at || "—";
                  return (
                    <tr
                      key={c.id || c.key}
                      className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--bg-hover)]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${isActive ? "bg-[var(--primary)]" : "bg-[var(--border-strong)]"}`}
                          />
                          <span className="text-xs text-[var(--text-secondary)]">
                            {isActive ? "Đang chạy" : "Tắt"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="rounded bg-[var(--bg-subtle)] px-2 py-1 text-[13px] font-semibold text-[var(--text-primary)]">
                          {c.key}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {c.value}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-[var(--text-secondary)]">
                          {c.description || "—"}
                        </span>
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <span className="text-xs text-[var(--text-muted)] tabular-nums">
                          {lastUpdated}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(c)}
                          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-[13px] font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)]"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Sửa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[500px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {editing ? "Sửa cấu hình" : "Thêm cấu hình mới"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Từ khóa cấu hình (Config Key)
                </label>
                <input
                  type="text"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  disabled={!!editing}
                  className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none disabled:bg-[var(--bg-subtle)] disabled:text-[var(--text-muted)] sm:text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Giá trị (Value)
                </label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Mô tả (Description)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
              <button
                disabled={saving}
                onClick={() => setShowModal(false)}
                className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                Hủy
              </button>
              <button
                disabled={saving}
                onClick={handleSave}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
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
