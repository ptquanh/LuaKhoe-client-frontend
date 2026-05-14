import React from "react";
import { Upload } from "lucide-react";

interface ModelsHeaderProps {
  total: number;
  onOpenUpload: () => void;
}

export function ModelsHeader({ total, onOpenUpload }: ModelsHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
          Quản lý mô hình
        </h1>
        <p className="mt-1 text-[14px] text-[#5C5C5C]">{total} phiên bản</p>
      </div>
      <button
        onClick={onOpenUpload}
        className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] text-white hover:bg-[#1F6F2E]"
      >
        <Upload className="h-4 w-4" /> Upload Model
      </button>
    </div>
  );
}
