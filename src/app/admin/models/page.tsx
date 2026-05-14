"use client";

import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

import { aiModelService } from "@/services/ai-model.service";
import { AiModel } from "@/types/ai-model.type";

import { ModelsHeader } from "./components/ModelsHeader";
import { ModelsTable } from "./components/ModelsTable";
import { UploadModelModal } from "./components/UploadModelModal";

export default function AdminModelsPage() {
  const [models, setModels] = useState<AiModel[]>([]);
  const [total, setTotal] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await aiModelService.getAllModels();
      if (res.success && res.data) {
        setModels(res.data.rows);
        setTotal(res.data.total);
      } else {
        message.error(res.message || "Không thể tải danh sách model");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải danh sách");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    if (currentlyActive) return;

    try {
      const res = await aiModelService.setActiveModel(id);
      if (res.success) {
        message.success("Cập nhật model đang kích hoạt thành công!");
        fetchModels();
      } else {
        message.error(res.message || "Lỗi khi kích hoạt model");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi gọi API");
    }
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <ModelsHeader total={total} onOpenUpload={() => setShowUpload(true)} />

      <ModelsTable
        models={models}
        isLoading={isLoading}
        onToggleActive={toggleActive}
      />

      {showUpload && (
        <UploadModelModal
          onClose={() => setShowUpload(false)}
          onSuccess={fetchModels}
        />
      )}
    </div>
  );
}
