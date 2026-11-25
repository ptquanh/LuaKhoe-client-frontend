"use client";

import { Image, message } from "antd";
import { Download, ImageIcon, Share2, ZoomIn } from "lucide-react";
import { useState } from "react";

interface ResultImagePreviewProps {
  originalImageUrl?: string;
  resultImageUrl?: string;
  supplementImageUrl?: string;
  diseaseName: string;
}

interface ImageItem {
  key: string;
  url: string;
  label: string;
  maskText: string;
  badgeClass: string;
}

export function ResultImagePreview({
  originalImageUrl,
  resultImageUrl,
  supplementImageUrl,
  diseaseName,
}: ResultImagePreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasDistinctAiImage =
    Boolean(resultImageUrl) && resultImageUrl !== originalImageUrl;

  const activeImages: ImageItem[] = [];

  if (hasDistinctAiImage && resultImageUrl) {
    activeImages.push({
      key: "ai",
      url: resultImageUrl,
      label: "AI Phân tích",
      maskText: "Phóng to ảnh AI phân tích",
      badgeClass: "bg-primary text-white",
    });
  }

  if (originalImageUrl) {
    activeImages.push({
      key: "original",
      url: originalImageUrl,
      label: hasDistinctAiImage ? "Ảnh gốc" : "Ảnh lá lúa",
      maskText: "Phóng to ảnh gốc",
      badgeClass: "bg-black/70 text-white",
    });
  } else if (resultImageUrl && !hasDistinctAiImage) {
    activeImages.push({
      key: "result-fallback",
      url: resultImageUrl,
      label: "Ảnh chẩn đoán",
      maskText: "Phóng to ảnh chẩn đoán",
      badgeClass: "bg-primary text-white",
    });
  }

  if (supplementImageUrl) {
    activeImages.push({
      key: "supplement",
      url: supplementImageUrl,
      label: "Ảnh cận cảnh",
      maskText: "Phóng to ảnh cận cảnh",
      badgeClass: "bg-sky-600 text-white",
    });
  }

  if (activeImages.length === 0) {
    return null;
  }

  const safeIndex =
    selectedIndex >= 0 && selectedIndex < activeImages.length
      ? selectedIndex
      : 0;
  const currentImage = activeImages[safeIndex];

  const handleDownload = () => {
    if (currentImage?.url) {
      window.open(currentImage.url, "_blank", "noopener,noreferrer");
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
        // User cancelled native share sheet
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        message.success("Đã sao chép đường dẫn chia sẻ vào bộ nhớ tạm!");
      } catch {
        message.error("Không thể sao chép đường dẫn.");
      }
    }
  };

  return (
    <section className="border-border bg-bg-card flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-4 shadow-xs sm:p-5">
      <div className="space-y-3">
        {/* Top Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {activeImages.length > 1 ? (
            <div
              role="tablist"
              aria-label="Chế độ xem hình ảnh"
              className="bg-bg-subtle inline-flex flex-wrap items-center gap-1 rounded-xl p-1"
            >
              {activeImages.map((img, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={img.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedIndex(idx)}
                    className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-bg-card text-text-primary shadow-xs"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {img.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-bg-subtle text-text-secondary flex h-8 w-8 items-center justify-center rounded-lg">
                <ImageIcon className="h-4 w-4" />
              </span>
              <span className="text-text-primary text-sm font-bold">
                Hình ảnh mẫu lá lúa
              </span>
            </div>
          )}

          <span className="bg-primary-soft text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold">
            <ZoomIn className="h-3 w-3" />
            Phóng to
          </span>
        </div>

        {/* Interactive Image Stage */}
        <Image.PreviewGroup>
          <div className="border-border bg-bg-subtle relative aspect-[4/3] w-full overflow-hidden rounded-xl border">
            <Image
              src={currentImage.url}
              alt={currentImage.label}
              className="object-cover"
              style={{ width: "100%", height: "100%" }}
              preview={{ mask: currentImage.maskText }}
            />
            <span
              className={`pointer-events-none absolute bottom-2.5 left-2.5 z-10 rounded-md px-2.5 py-1 text-[11px] font-bold shadow-xs select-none ${currentImage.badgeClass}`}
            >
              {currentImage.label}
            </span>
          </div>

          {/* Keep remaining images mounted inside PreviewGroup for lightbox navigation */}
          {activeImages.length > 1 && (
            <div className="hidden" aria-hidden="true">
              {activeImages.map((img, idx) =>
                idx === safeIndex ? null : (
                  <Image key={img.key} src={img.url} alt={img.label} />
                ),
              )}
            </div>
          )}
        </Image.PreviewGroup>

        {/* Thumbnail Strip */}
        {activeImages.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {activeImages.map((img, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={img.key}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                    isActive
                      ? "border-primary ring-primary/25 ring-2"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Xem ${img.label}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.label}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Quick Actions */}
      <div className="border-border mt-4 flex items-center gap-2.5 border-t pt-3.5">
        <button
          type="button"
          onClick={handleDownload}
          className="border-border bg-bg-subtle/70 text-text-primary hover:bg-bg-hover flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors sm:text-sm"
        >
          <Download className="h-4 w-4" /> Tải ảnh
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="bg-primary hover:bg-primary-hover flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-white shadow-xs transition-colors sm:text-sm"
        >
          <Share2 className="h-4 w-4" /> Chia sẻ
        </button>
      </div>
    </section>
  );
}
