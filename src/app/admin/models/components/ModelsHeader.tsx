import { Upload } from "lucide-react";
import React from "react";

import { PageHeader } from "@/components/ui/PageHeader";

interface ModelsHeaderProps {
  total: number;
  onOpenUpload: () => void;
}

export function ModelsHeader({ total, onOpenUpload }: ModelsHeaderProps) {
  return (
    <PageHeader
      title="Quản lý mô hình"
      description={`${total} phiên bản`}
      actions={
        <button
          onClick={onOpenUpload}
          className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          <Upload className="h-4 w-4" aria-hidden="true" /> Tải lên mô hình
        </button>
      }
    />
  );
}
