import { Loader2, Pencil, Trash2 } from "lucide-react";

import { AiModel } from "@/types/ai-model.type";

interface ModelsTableProps {
  models: AiModel[];
  isLoading: boolean;
  isActivating: boolean;
  onToggleActive: (id: string, currentlyActive: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (model: AiModel) => void;
}

export function ModelsTable({
  models,
  isLoading,
  isActivating,
  onToggleActive,
  onDelete,
  onEdit,
}: ModelsTableProps) {
  const handleDeleteClick = (id: string, versionName: string) => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa mô hình AI phiên bản "${versionName}" không? Hành động này không thể hoàn tác.`,
      )
    ) {
      onDelete(id);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F0F2F5]">
            <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
              Version
            </th>
            <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
              File Cloud URL / Path
            </th>
            <th className="hidden h-12 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
              Updated At
            </th>
            <th className="h-12 w-32 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
              Trạng thái
            </th>
            <th className="h-12 w-28 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="h-32 text-center text-[#5C5C5C]">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#2F9E44]" />
                <p className="mt-2 text-[14px]">Đang tải dữ liệu...</p>
              </td>
            </tr>
          ) : models.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="h-32 text-center text-[14px] text-[#5C5C5C]"
              >
                Chưa có model nào.
              </td>
            </tr>
          ) : (
            models.map((m, i) => (
              <tr
                key={m.id}
                className={`h-12 border-t border-[#E0E0E0] hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
              >
                <td className="px-4 text-[14px] font-[500] text-[#1B1B1B]">
                  {m.versionName}
                  {m.isActive && (
                    <span className="ml-2 rounded bg-[#E6F4EA] px-1.5 py-0.5 text-[11px] font-[600] text-[#2E7D32]">
                      Active
                    </span>
                  )}
                </td>
                <td
                  className="max-w-[300px] truncate px-4 text-left text-[13px] text-[#5C5C5C]"
                  title={m.filePath}
                >
                  {m.filePath}
                </td>
                <td className="hidden px-4 text-center text-[14px] text-[#5C5C5C] md:table-cell">
                  {new Date(m.updatedAt || m.createdAt).toLocaleDateString(
                    "vi-VN",
                  )}
                </td>
                <td className="px-4 text-center">
                  <button
                    onClick={() => onToggleActive(m.id, m.isActive)}
                    disabled={isActivating || isLoading}
                    className={`mx-auto flex cursor-pointer items-center justify-center rounded border px-2.5 py-1.5 text-[12px] font-[600] transition-all duration-200 ${
                      m.isActive
                        ? "border-[#FFD8D8] bg-[#FFF5F5] text-[#FA5252] hover:border-[#FFA8A8] hover:bg-[#FFE3E3] active:bg-[#FFC9C9]"
                        : "border-[#D4EDDA] bg-[#E6F4EA] text-[#2E7D32] hover:border-[#C3E6CB] hover:bg-[#D4EDDA] active:bg-[#B7EB8F]"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                    title={
                      m.isActive
                        ? "Nhấp để hủy kích hoạt mô hình"
                        : "Nhấp để kích hoạt mô hình (Hot-Reload)"
                    }
                  >
                    {m.isActive ? "Hủy kích hoạt" : "Kích hoạt"}
                  </button>
                </td>
                <td className="px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onEdit(m)}
                      disabled={isActivating || isLoading}
                      className="rounded p-1.5 text-[#1A73E8] transition-colors hover:bg-[#E8F0FE] hover:text-[#1557B0] disabled:cursor-not-allowed disabled:opacity-50"
                      title="Chỉnh sửa thông tin/file"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {!m.isActive ? (
                      <button
                        onClick={() => handleDeleteClick(m.id, m.versionName)}
                        disabled={isActivating || isLoading}
                        className="rounded p-1.5 text-[#E03131] transition-colors hover:bg-[#FFECEB] hover:text-[#C92A2A] disabled:cursor-not-allowed disabled:opacity-50"
                        title="Xóa mô hình AI"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="w-7 text-[12px] text-[#8C8C8C] italic select-none">
                        Khóa
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
