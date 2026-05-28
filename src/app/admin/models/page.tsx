"use client";

import { message } from "antd";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { useAiModel } from "@/hooks/useAiModel";
import { AiModel } from "@/types/ai-model.type";

import { EditModelModal } from "./components/EditModelModal";
import { ModelsHeader } from "./components/ModelsHeader";
import { ModelsTable } from "./components/ModelsTable";
import { UploadModelModal } from "./components/UploadModelModal";

export default function AdminModelsPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [editingModel, setEditingModel] = useState<AiModel | null>(null);

  // Use the new React Query hook for handling AI models MLOps pipeline
  const {
    modelsData,
    isLoading,
    activateModel,
    deleteModel,
    refetch,
    isActivating,
  } = useAiModel();

  const models = modelsData?.rows || [];
  const total = modelsData?.total || 0;

  const activeModelCount = models.filter((m: AiModel) => m.isActive).length;

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    const actionText = currentlyActive ? "hủy kích hoạt" : "kích hoạt và nạp";
    const hide = message.loading(`Đang ${actionText} mô hình AI...`, 0);
    try {
      const res = await activateModel(id);
      if (res.success) {
        message.success(
          currentlyActive
            ? "Hủy kích hoạt mô hình AI thành công!"
            : "Kích hoạt và nạp mô hình AI (Hot-Reload) thành công!",
        );
      } else {
        message.error(res.message || `Lỗi khi ${actionText} mô hình`);
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        `Đã xảy ra lỗi khi gọi API ${actionText}`;
      message.error(errorMsg);
    } finally {
      hide();
    }
  };

  const handleDelete = async (id: string) => {
    const hide = message.loading("Đang xóa mô hình AI...", 0);
    try {
      const res = await deleteModel(id);
      if (res.success) {
        message.success("Xóa mô hình AI thành công!");
      } else {
        message.error(res.message || "Xóa mô hình thất bại");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Đã xảy ra lỗi khi gọi API xóa";
      message.error(errorMsg);
    } finally {
      hide();
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] p-4">
      <ModelsHeader total={total} onOpenUpload={() => setShowUpload(true)} />

      {/* Yellow Warning Banner for Zero Active Models */}
      {!isLoading && activeModelCount === 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#FFE8CC] bg-[#FFF9DB] p-4 text-[#D9480F]">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[#F59F00]" />
          <div>
            <h5 className="text-[14px] font-[600] text-[#D9480F]">
              Cảnh báo hệ thống
            </h5>
            <p className="mt-1 text-[13px] leading-relaxed text-[#E67E22]">
              Hiện không có mô hình AI nào ở trạng thái hoạt động. Các yêu cầu
              chẩn đoán tự động trên ứng dụng LuaKhoe sẽ tạm thời phản hồi lỗi
              bảo trì. Vui lòng kích hoạt ít nhất một phiên bản!
            </p>
          </div>
        </div>
      )}

      <ModelsTable
        models={models}
        isLoading={isLoading}
        isActivating={isActivating}
        onToggleActive={toggleActive}
        onDelete={handleDelete}
        onEdit={(model) => setEditingModel(model)}
      />

      {showUpload && (
        <UploadModelModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => refetch()}
        />
      )}

      {editingModel && (
        <EditModelModal
          model={editingModel}
          onClose={() => setEditingModel(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
