"use client";

import { Image } from "antd";
import { Download, ImageIcon, Share2 } from "lucide-react";

interface ResultImagePreviewProps {
  originalImageUrl?: string;
  resultImageUrl?: string;
  supplementImageUrl?: string;
  diseaseName: string;
}

export function ResultImagePreview({
  originalImageUrl,
  resultImageUrl,
  supplementImageUrl,
  diseaseName,
}: ResultImagePreviewProps) {
  const activeImages = [
    { url: originalImageUrl, label: "Ảnh gốc", maskText: "Phóng to ảnh gốc" },
    { url: resultImageUrl, label: "AI Phân tích", maskText: "Phóng to ảnh AI" },
    {
      url: supplementImageUrl,
      label: "Ảnh cận cảnh",
      maskText: "Phóng to ảnh cận cảnh",
    },
  ].filter((item) => Boolean(item.url));

  const count = activeImages.length;

  const gridClass =
    count === 3
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      : count === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1";

  const primaryDownloadUrl =
    resultImageUrl || originalImageUrl || supplementImageUrl || "";

  const handleDownload = () => {
    if (primaryDownloadUrl) {
      window.open(primaryDownloadUrl, "_blank");
    }
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

  if (count === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between border-b border-[#F0F0F0] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F7F7] text-[#5C5C5C]">
            <ImageIcon className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[17px] font-[700] text-[#1B1B1B]">
            Hình ảnh chẩn đoán chi tiết ({count})
          </h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-[600] text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
          💡 Click ảnh để so sánh & thu phóng
        </span>
      </div>

      <Image.PreviewGroup>
        <div className={`grid ${gridClass} gap-4`}>
          {activeImages.map((img, idx) => (
            <div
              key={idx}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E0E0E0]/60 bg-gray-50 transition-shadow hover:shadow-sm sm:aspect-[16/10]"
            >
              <Image
                src={img.url}
                alt={img.label}
                className="object-cover"
                style={{ width: "100%", height: "100%" }}
                preview={{ mask: img.maskText }}
              />
              <div
                className={`absolute bottom-3 left-3 z-10 rounded-md px-2.5 py-1 text-xs font-[700] text-white shadow-xs select-none ${
                  img.label === "AI Phân tích"
                    ? "bg-[#2F9E44]/90"
                    : img.label === "Ảnh cận cảnh"
                      ? "bg-blue-600/90"
                      : "bg-black/60"
                }`}
              >
                {img.label}
              </div>
            </div>
          ))}
        </div>
      </Image.PreviewGroup>

      <div className="mt-5 flex flex-wrap justify-end gap-2.5 border-t border-[#F0F0F0] pt-4">
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
