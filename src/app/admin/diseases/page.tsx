"use client";

import { message, Modal } from "antd";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { DiseaseItem, diseaseService } from "@/services/disease.service";

const severityMap: Record<string, { label: string; badgeClass: string }> = {
  high: {
    label: "Nghiêm trọng",
    badgeClass: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
  medium: {
    label: "Trung bình",
    badgeClass:
      "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  },
  low: {
    label: "Nhẹ",
    badgeClass:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
};

const PAGE_SIZE = 10;

export default function AdminDiseasesPage() {
  const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal & Form states
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<DiseaseItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    scientificName: "",
    signs: "",
    severity: "medium",
    treatment: "",
    imageUrl: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const keywordParam =
        debouncedSearch.trim().length > 0 && debouncedSearch.trim().length < 3
          ? undefined
          : debouncedSearch.trim() || undefined;

      const res = await diseaseService.getDiseasesForAdmin({
        keyword: keywordParam,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
      if (res.success && res.data) {
        setDiseases(res.data.rows);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách bệnh:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, [debouncedSearch, page]);

  const handleEdit = (d: DiseaseItem) => {
    setEditing(d);
    setForm({
      name: d.name,
      scientificName: d.scientificName || "",
      signs: d.signs || "",
      severity: d.severity || "medium",
      treatment: d.treatment || "",
      imageUrl: d.imageUrl || "",
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      scientificName: "",
      signs: "",
      severity: "medium",
      treatment: "",
      imageUrl: "",
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await diseaseService.uploadImage(file);
      if (res.success && res.data) {
        setForm((prev) => ({ ...prev, imageUrl: res.data!.imageUrl }));
        message.success("Đã tải ảnh minh họa lên thành công.");
      } else {
        message.error(res.message || "Tải ảnh lên thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      message.error("Tải ảnh thất bại do lỗi kết nối.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      message.warning("Vui lòng nhập tên bệnh!");
      return;
    }

    setSaveLoading(true);
    try {
      let res;
      if (editing) {
        res = await diseaseService.updateDisease(editing.id, form);
      } else {
        res = await diseaseService.createDisease(form);
      }

      if (res.success) {
        message.success(
          editing ? "Đã cập nhật thông tin bệnh." : "Đã thêm bệnh mới.",
        );
        setShowModal(false);
        fetchDiseases();
      } else {
        message.error(res.message || "Lưu thất bại");
      }
    } catch (error) {
      console.error("Lỗi lưu thông tin bệnh:", error);
      message.error("Đã xảy ra lỗi khi lưu thông tin bệnh.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa dữ liệu bệnh",
      content: "Bạn có chắc chắn muốn xóa bệnh này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await diseaseService.deleteDisease(id);
          if (res.success) {
            message.success("Đã xóa bệnh thành công.");
            fetchDiseases();
          } else {
            message.error(res.message || "Xóa thất bại");
          }
        } catch (error) {
          console.error("Lỗi xóa bệnh:", error);
          message.error("Đã xảy ra lỗi khi xóa bệnh.");
        }
      },
    });
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="Quản lý Bệnh lúa"
        description={loading ? "Đang tải..." : `${total} loại bệnh`}
        actions={
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="relative min-w-[200px] flex-1 sm:w-[220px] sm:flex-none">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bệnh..."
                className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pr-4 pl-10 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
              />
            </div>
            <button
              onClick={handleAdd}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              <Plus className="h-4 w-4" /> Thêm bệnh
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="flex items-center gap-4">
              <Skeleton className="h-12 w-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : diseases.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Không tìm thấy dữ liệu bệnh lúa nào"
          description="Thử thay đổi từ khóa hoặc thêm dữ liệu bệnh lúa mới."
        />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {diseases.map((d) => {
              const sev =
                severityMap[d.severity || "medium"] || severityMap.medium;
              return (
                <div
                  key={d.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4"
                >
                  <div className="flex gap-3">
                    {d.imageUrl ? (
                      <img
                        src={d.imageUrl}
                        alt={d.name}
                        className="h-14 w-20 shrink-0 rounded-lg border border-[var(--border)] object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-[10px] text-[var(--text-muted)]">
                        Không ảnh
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-1.5">
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">
                          {d.name}
                        </h3>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${sev.badgeClass}`}
                        >
                          {sev.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {d.scientificName || "N/A"}
                      </p>
                    </div>
                  </div>
                  {d.signs && (
                    <p className="mt-2 line-clamp-2 text-xs text-[var(--text-secondary)]">
                      {d.signs}
                    </p>
                  )}
                  <div className="mt-3 flex justify-end gap-2 border-t border-[var(--border)] pt-3">
                    <button
                      onClick={() => handleEdit(d)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--primary-soft)]"
                      aria-label="Sửa bệnh"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                      aria-label="Xóa bệnh"
                    >
                      <Trash2 className="h-4 w-4" />
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
                  <th className="h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Hình ảnh
                  </th>
                  <th className="h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Tên bệnh
                  </th>
                  <th className="h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Tên tiếng Anh / Khoa học
                  </th>
                  <th className="h-12 w-28 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                    Mức độ
                  </th>
                  <th className="hidden h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)] lg:table-cell">
                    Triệu chứng
                  </th>
                  <th className="h-12 w-28 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((d) => {
                  const sev =
                    severityMap[d.severity || "medium"] || severityMap.medium;
                  return (
                    <tr
                      key={d.id}
                      className="h-16 border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-hover)]"
                    >
                      <td className="px-4">
                        {d.imageUrl ? (
                          <img
                            src={d.imageUrl}
                            alt={d.name}
                            className="h-10 w-14 rounded-lg border border-[var(--border)] object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-14 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-[10px] text-[var(--text-muted)]">
                            Không ảnh
                          </div>
                        )}
                      </td>
                      <td className="px-4 text-sm font-medium text-[var(--text-primary)]">
                        {d.name}
                      </td>
                      <td className="px-4 text-sm text-[var(--text-secondary)]">
                        {d.scientificName || "N/A"}
                      </td>
                      <td className="px-4 text-center">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sev.badgeClass}`}
                        >
                          {sev.label}
                        </span>
                      </td>
                      <td className="hidden max-w-[250px] truncate px-4 text-[13px] text-[var(--text-secondary)] lg:table-cell">
                        {d.signs || "N/A"}
                      </td>
                      <td className="px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(d)}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[var(--primary)] hover:bg-[var(--primary-soft)]"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)] tabular-nums">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} / {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-10 min-w-10 cursor-pointer rounded-lg px-2 text-sm font-medium tabular-nums ${p === page ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
          <div className="my-auto w-full max-w-[560px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {editing ? "Sửa bệnh" : "Thêm bệnh mới"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-primary)]">
                    Tên bệnh (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                    placeholder="Ví dụ: Bệnh đạo ôn"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-primary)]">
                    Tên tiếng Anh / Khoa học
                  </label>
                  <input
                    type="text"
                    value={form.scientificName}
                    onChange={(e) =>
                      setForm({ ...form, scientificName: e.target.value })
                    }
                    className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                    placeholder="Ví dụ: Rice Blast"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-primary)]">
                  Mức độ nghiêm trọng
                </label>
                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm({ ...form, severity: e.target.value })
                  }
                  className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                >
                  <option value="low">Nhẹ (Low)</option>
                  <option value="medium">Trung bình (Medium)</option>
                  <option value="high">Nghiêm trọng (High)</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-primary)]">
                  Triệu chứng / Dấu hiệu
                </label>
                <textarea
                  value={form.signs}
                  onChange={(e) => setForm({ ...form, signs: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                  placeholder="Mô tả các triệu chứng của bệnh..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-primary)]">
                  Phác đồ điều trị
                </label>
                <textarea
                  value={form.treatment}
                  onChange={(e) =>
                    setForm({ ...form, treatment: e.target.value })
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                  placeholder="Cách xử lý, phun thuốc hóa học, chế phẩm sinh học..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[var(--text-primary)]">
                  Hình ảnh minh họa
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {form.imageUrl ? (
                    <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-[var(--border)]">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, imageUrl: "" }))
                        }
                        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-subtle)] transition-colors hover:bg-[var(--bg-hover)]">
                      <Upload className="h-5 w-5 text-[var(--text-muted)]" />
                      <span className="mt-1 text-[11px] text-[var(--text-muted)]">
                        Chọn ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  {uploadingImage && (
                    <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
                      <span>Đang tải ảnh lên...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={saveLoading}
                className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saveLoading || uploadingImage}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"
              >
                {saveLoading ? (
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
