import { Modal } from "antd";
import { Pencil, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
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
    Modal.confirm({
      title: "Xóa mô hình AI",
      content: `Bạn có chắc chắn muốn xóa mô hình AI phiên bản "${versionName}" không? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => onDelete(id),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <EmptyState
        title="Chưa có mô hình AI nào"
        description="Hãy tải lên phiên bản mô hình ONNX đầu tiên để bắt đầu phục vụ chẩn đoán."
      />
    );
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {models.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {m.versionName}
                </span>
                {m.isActive && (
                  <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)]">
                    Active
                  </span>
                )}
              </div>
              <span className="text-xs text-[var(--text-muted)] tabular-nums">
                {new Date(m.updatedAt || m.createdAt).toLocaleDateString(
                  "vi-VN",
                )}
              </span>
            </div>
            <p className="mt-2 truncate text-xs text-[var(--text-secondary)]">
              {m.filePath}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
              <button
                onClick={() => onToggleActive(m.id, m.isActive)}
                disabled={isActivating}
                className={`flex min-h-10 cursor-pointer items-center justify-center rounded-lg border px-3 text-xs font-semibold transition-colors disabled:opacity-50 ${
                  m.isActive
                    ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                    : "border-[var(--primary)]/30 bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)]/15"
                }`}
              >
                {m.isActive ? "Hủy kích hoạt" : "Kích hoạt"}
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(m)}
                  disabled={isActivating}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-sky-600 transition-colors hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/30"
                  title="Chỉnh sửa thông tin/file"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {!m.isActive && (
                  <button
                    onClick={() => handleDeleteClick(m.id, m.versionName)}
                    disabled={isActivating}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    title="Xóa mô hình AI"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                Version
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                File Cloud URL / Path
              </th>
              <th className="h-12 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                Updated At
              </th>
              <th className="h-12 w-36 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                Trạng thái
              </th>
              <th className="h-12 w-28 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr
                key={m.id}
                className="h-14 border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-hover)]"
              >
                <td className="px-4 text-sm font-medium text-[var(--text-primary)]">
                  {m.versionName}
                  {m.isActive && (
                    <span className="ml-2 rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)]">
                      Active
                    </span>
                  )}
                </td>
                <td
                  className="max-w-[300px] truncate px-4 text-left text-[13px] text-[var(--text-secondary)]"
                  title={m.filePath}
                >
                  {m.filePath}
                </td>
                <td className="px-4 text-center text-sm text-[var(--text-secondary)] tabular-nums">
                  {new Date(m.updatedAt || m.createdAt).toLocaleDateString(
                    "vi-VN",
                  )}
                </td>
                <td className="px-4 text-center">
                  <button
                    onClick={() => onToggleActive(m.id, m.isActive)}
                    disabled={isActivating || isLoading}
                    className={`mx-auto flex min-h-9 cursor-pointer items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      m.isActive
                        ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                        : "border-[var(--primary)]/30 bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)]/15"
                    }`}
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
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sky-600 transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-sky-400 dark:hover:bg-sky-950/30"
                      title="Chỉnh sửa thông tin/file"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {!m.isActive ? (
                      <button
                        onClick={() => handleDeleteClick(m.id, m.versionName)}
                        disabled={isActivating || isLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                        title="Xóa mô hình AI"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="w-7 text-xs text-[var(--text-muted)] italic select-none">
                        Khóa
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
