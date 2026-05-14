import { Loader2 } from "lucide-react";
import React from "react";

import { AiModel } from "@/types/ai-model.type";

interface ModelsTableProps {
  models: AiModel[];
  isLoading: boolean;
  onToggleActive: (id: string, currentlyActive: boolean) => void;
}

export function ModelsTable({
  models,
  isLoading,
  onToggleActive,
}: ModelsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F0F2F5]">
            <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
              Version
            </th>
            <th className="h-12 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
              File Path
            </th>
            <th className="hidden h-12 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
              Updated At
            </th>
            <th className="h-12 w-24 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
              Active
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="h-32 text-center text-[#5C5C5C]">
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                <p className="mt-2 text-[14px]">Đang tải dữ liệu...</p>
              </td>
            </tr>
          ) : models.length === 0 ? (
            <tr>
              <td
                colSpan={4}
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
                    <span className="ml-2 rounded bg-[#E6F4EA] px-1.5 py-0.5 text-[11px] text-[#2E7D32]">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 text-center text-[14px] text-[#5C5C5C]">
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
                    className={`relative h-6 w-10 cursor-pointer rounded-full transition-colors ${m.isActive ? "bg-[#2F9E44]" : "bg-[#E0E0E0]"}`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${m.isActive ? "left-5" : "left-1"}`}
                    />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
