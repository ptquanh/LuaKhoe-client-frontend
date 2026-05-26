"use client";

import { DiseaseItem, diseaseService } from "@/services/disease.service";
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

const severityMap: Record<string, { label: string; bg: string; text: string }> =
  {
    high: { label: "Nghiêm trọng", bg: "bg-[#FFEBEE]", text: "text-[#C62828]" },
    medium: { label: "Trung bình", bg: "bg-[#FFF3E0]", text: "text-[#E65100]" },
    low: { label: "Nhẹ", bg: "bg-[#E6F4EA]", text: "text-[#2E7D32]" },
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
      } else {
        alert(res.message || "Tải ảnh lên thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      alert("Tải ảnh thất bại do lỗi kết nối.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên bệnh!");
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
        setShowModal(false);
        fetchDiseases();
      } else {
        alert(res.message || "Lưu thất bại");
      }
    } catch (error) {
      console.error("Lỗi lưu thông tin bệnh:", error);
      alert("Đã xảy ra lỗi khi lưu thông tin bệnh.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bệnh này không?")) return;

    try {
      const res = await diseaseService.deleteDisease(id);
      if (res.success) {
        fetchDiseases();
      } else {
        alert(res.message || "Xóa thất bại");
      }
    } catch (error) {
      console.error("Lỗi xóa bệnh:", error);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            Quản lý Bệnh lúa
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            {loading ? "Đang tải..." : `${total} loại bệnh`}
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
            className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white transition-colors hover:bg-[#1F6F2E]"
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
                Hình ảnh
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Tên bệnh
              </th>
              <th className="hidden h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Tên tiếng Anh / Khoa học
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
            {loading ? (
              <tr>
                <td colSpan={6} className="h-40 text-center text-[#5C5C5C]">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2F9E44]" />
                  <p className="mt-2 text-[14px]">Đang tải danh sách...</p>
                </td>
              </tr>
            ) : diseases.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="h-40 text-center text-[14px] text-[#5C5C5C]"
                >
                  Không tìm thấy dữ liệu bệnh lúa nào.
                </td>
              </tr>
            ) : (
              diseases.map((d, i) => {
                const sev =
                  severityMap[d.severity || "medium"] || severityMap.medium;
                return (
                  <tr
                    key={d.id}
                    className={`h-16 border-t border-[#E0E0E0] hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
                  >
                    <td className="px-4">
                      {d.imageUrl ? (
                        <img
                          src={d.imageUrl}
                          alt={d.name}
                          className="h-10 w-14 rounded border border-[#E0E0E0] object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded border border-[#E0E0E0] bg-[#F9FAFB] text-[10px] text-[#8C8C8C]">
                          Không ảnh
                        </div>
                      )}
                    </td>
                    <td className="px-4 text-[14px] font-[500] text-[#1B1B1B]">
                      {d.name}
                    </td>
                    <td className="hidden px-4 text-[14px] text-[#5C5C5C] md:table-cell">
                      {d.scientificName || "N/A"}
                    </td>
                    <td className="px-4 text-center">
                      <span
                        className={`inline-block h-5 rounded px-2 text-[11px] leading-[20px] font-[500] ${sev.bg} ${sev.text}`}
                      >
                        {sev.label}
                      </span>
                    </td>
                    <td className="hidden max-w-[250px] truncate px-4 text-[13px] text-[#5C5C5C] lg:table-cell">
                      {d.signs || "N/A"}
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
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[12px] text-[#5C5C5C]">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} / {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 cursor-pointer rounded-md text-[14px] font-[500] ${p === page ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
          <div className="my-auto w-full max-w-[560px] rounded-xl bg-white shadow-2xl">
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
            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-[600] text-[#1B1B1B]">
                    Tên bệnh (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                    placeholder="Ví dụ: Bệnh đạo ôn"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-[600] text-[#1B1B1B]">
                    Tên tiếng Anh / Khoa học
                  </label>
                  <input
                    type="text"
                    value={form.scientificName}
                    onChange={(e) =>
                      setForm({ ...form, scientificName: e.target.value })
                    }
                    className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                    placeholder="Ví dụ: Rice Blast"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-[600] text-[#1B1B1B]">
                  Mức độ nghiêm trọng
                </label>
                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm({ ...form, severity: e.target.value })
                  }
                  className="h-10 w-full rounded-lg border border-[#E0E0E0] px-3 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                >
                  <option value="low">Nhẹ (Low)</option>
                  <option value="medium">Trung bình (Medium)</option>
                  <option value="high">Nghiêm trọng (High)</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-[600] text-[#1B1B1B]">
                  Triệu chứng / Dấu hiệu
                </label>
                <textarea
                  value={form.signs}
                  onChange={(e) => setForm({ ...form, signs: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                  placeholder="Mô tả các triệu chứng của bệnh..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-[600] text-[#1B1B1B]">
                  Phác đồ điều trị
                </label>
                <textarea
                  value={form.treatment}
                  onChange={(e) =>
                    setForm({ ...form, treatment: e.target.value })
                  }
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
                  placeholder="Cách xử lý, phun thuốc hóa học, chế phẩm sinh học..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-[600] text-[#1B1B1B]">
                  Hình ảnh minh họa
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {form.imageUrl ? (
                    <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-[#E0E0E0]">
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
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E0E0E0] bg-[#F9FAFB] transition-colors hover:bg-[#F0F2F5]">
                      <Upload className="h-5 w-5 text-[#8C8C8C]" />
                      <span className="mt-1 text-[11px] text-[#8C8C8C]">
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
                    <div className="flex items-center gap-1.5 text-[13px] text-[#5C5C5C]">
                      <Loader2 className="h-4 w-4 animate-spin text-[#2F9E44]" />
                      <span>Đang tải ảnh lên...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#E0E0E0] px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={saveLoading}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saveLoading || uploadingImage}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] font-[500] text-white transition-colors hover:bg-[#1F6F2E] disabled:opacity-50"
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
