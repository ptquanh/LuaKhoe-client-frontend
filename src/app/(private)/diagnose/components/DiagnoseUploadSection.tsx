import { Loader2, Upload, X } from "lucide-react";
import React, { useState } from "react";

interface DiagnoseUploadSectionProps {
  file: { raw: File; url: string } | null;
  onFileSelect: (f: File) => void;
  result: any;
  isLoading: boolean;
  description: string;
  setDescription: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  suggestedTags: string[];
  handleReset: () => void;
  handlePredict: () => void;
}

export function DiagnoseUploadSection({
  file,
  onFileSelect,
  result,
  isLoading,
  description,
  setDescription,
  selectedTags,
  setSelectedTags,
  suggestedTags,
  handleReset,
  handlePredict,
}: DiagnoseUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      onFileSelect(f);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      onFileSelect(f);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          className={`flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? "border-[#2F9E44] bg-[#E6F4EA]"
              : "border-[#E0E0E0] bg-white hover:border-[#2F9E44] hover:bg-[#E6F4EA]/30"
          }`}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F4EA]">
            <Upload className="h-7 w-7 text-[#2F9E44]" />
          </div>
          <h3 className="mb-2 text-[18px] font-[600] text-[#1B1B1B]">
            Kéo thả hoặc chọn file
          </h3>
          <p className="mb-6 text-[14px] text-[#5C5C5C]">
            Hỗ trợ JPG, PNG, WEBP. Tối đa 10MB
          </p>
          <button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] text-white hover:bg-[#1F6F2E]">
            <Upload className="h-4 w-4" /> Chọn ảnh
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
          <div className="relative flex aspect-video w-full items-center justify-center bg-black/5 p-2">
            <div className="absolute top-2 left-2 z-10 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
              <span className="text-[11px] font-[600] tracking-wide text-white uppercase">
                Ảnh gốc
              </span>
            </div>
            <img
              src={file.url}
              alt="Preview"
              className="max-h-[300px] rounded-lg object-contain shadow-sm"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#2F9E44]" />
                <p className="text-[14px] font-[500] text-[#2F9E44]">
                  AI đang phân tích hình ảnh...
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-[#E0E0E0] bg-[#FAFAFA] p-4">
            <label className="mb-2 block text-[13px] font-[500] text-[#1B1B1B]">
              Mô tả triệu chứng (Tùy chọn)
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`h-7 cursor-pointer rounded-full px-2.5 text-[12px] font-[500] transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-[#2F9E44] text-white"
                      : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập chi tiết..."
              rows={2}
              className="mb-4 w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[13px] focus:border-[#2F9E44] focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="h-11 flex-1 cursor-pointer rounded-lg border border-[#E0E0E0] text-[15px] font-[500] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] disabled:opacity-50"
              >
                Hủy
              </button>
              {!result && (
                <button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="h-11 flex-1 cursor-pointer rounded-lg bg-[#2F9E44] text-[15px] font-[500] text-white transition-colors hover:bg-[#1F6F2E] disabled:opacity-50"
                >
                  Phân tích
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
