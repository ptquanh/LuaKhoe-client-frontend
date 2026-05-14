"use client";

import { Download, ImageIcon, Share2 } from "lucide-react";
import React from "react";

import { ImageWithFallback } from "@/components/ImageWithFallback";

interface ResultImagePreviewProps {
  imageUrl: string;
  diseaseName: string;
}

export function ResultImagePreview({
  imageUrl,
  diseaseName,
}: ResultImagePreviewProps) {
  const handleDownload = () => {
    window.open(imageUrl, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chẩn đoán lúa: ${diseaseName}`,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép đường dẫn chia sẻ vào bộ nhớ tạm!");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3.5 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F7F7] text-[#5C5C5C]">
          <ImageIcon className="h-4.5 w-4.5" />
        </div>
        <h3 className="text-[17px] font-[700] text-[#1B1B1B]">
          Ảnh chẩn đoán AI
        </h3>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[#E0E0E0]/60 bg-[#F7F7F7] md:aspect-[21/9]">
        <ImageWithFallback
          src={imageUrl}
          alt={diseaseName}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2.5">
        <button
          onClick={handleDownload}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#E0E0E0] px-4 text-[14px] font-[600] text-[#5C5C5C] transition-colors hover:bg-[#F7F7F7] hover:text-[#1B1B1B]"
        >
          <Download className="h-4 w-4" /> Tải ảnh về
        </button>
        <button
          onClick={handleShare}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#2F9E44] px-4 text-[14px] font-[600] text-white shadow-sm transition-colors hover:bg-[#1F6F2E]"
        >
          <Share2 className="h-4 w-4" /> Chia sẻ kết quả
        </button>
      </div>
    </div>
  );
}
