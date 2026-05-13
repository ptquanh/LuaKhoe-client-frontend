"use client";

import { useState, useRef, Suspense } from "react";
import {
  Upload,
  Camera,
  X,
  Loader2,
  Info,
  Sun,
  Maximize,
  Droplets,
  Leaf,
  CheckCircle,
  XCircle,
  MapPin,
  Mic,
  MicOff,
  Map as MapIcon,
  ChevronRight,
  Search,
} from "lucide-react";
import { useDiagnose } from "@/hooks/useDiagnose";
import { ImageWithFallback } from "@/components/ImageWithFallback";

const goodExamples = [
  {
    url: "https://images.unsplash.com/photo-1658315216731-d0548fd66f25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JlZW4lMjByaWNlJTIwbGVhZiUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc0NDQ1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    label: "Rõ nét, đủ sáng",
  },
  {
    url: "https://images.unsplash.com/photo-1600420636132-5ccf1ffd711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwbGVhZiUyMGRpc2Vhc2UlMjBicm93biUyMHNwb3QlMjBjbG9zZXxlbnwxfHx8fDE3NzQ0NDUzMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    label: "Thấy rõ vết bệnh",
  },
];

const badExamples = [
  {
    url: "https://images.unsplash.com/photo-1770622477798-136376ccbe4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVycnklMjBwbGFudCUyMGxlYWYlMjBvdXQlMjBvZiUyMGZvY3VzfGVufDF8fHx8MTc3NDQ0NTMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    label: "Bị mờ, không rõ",
  },
  {
    url: "https://images.unsplash.com/photo-1595934542389-3a76137b756e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwdW5kZXJleHBvc2VkJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3NDQ0NTMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    label: "Quá tối, thiếu sáng",
  },
];

const suggestedTags = [
  "Lá vàng",
  "Có đốm",
  "Thân héo",
  "Mới gieo sạ",
  "Lá khô",
  "Cháy lá",
  "Rễ thối",
  "Bông bị cháy",
];

export default function DiagnosePage() {
  const { predict, isLoading, result, error, reset } = useDiagnose();

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<{ raw: File; url: string } | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  const [locationMode, setLocationMode] = useState<"default" | "gps" | "map">(
    "default",
  );
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      setFile({ raw: f, url: URL.createObjectURL(f) });
      reset();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile({ raw: f, url: URL.createObjectURL(f) });
      reset();
    }
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  const handlePredict = () => {
    if (file) {
      predict(file.raw);
    }
  };

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const isHealthy = result?.disease_key === "Healthy";
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          color: "text-[#E53935]",
          bg: "bg-[#FFEBEE]",
          border: "border-[#FFCDD2]",
          label: "Cấp bách",
        };
      case "high":
        return {
          color: "text-[#FB8C00]",
          bg: "bg-[#FFF3E0]",
          border: "border-[#FFE0B2]",
          label: "Nghiêm trọng",
        };
      case "medium":
        return {
          color: "text-[#FBC02D]",
          bg: "bg-[#FFFDE7]",
          border: "border-[#FFF9C4]",
          label: "Trung bình",
        };
      case "low":
        return {
          color: "text-[#2F9E44]",
          bg: "bg-[#E6F4EA]",
          border: "border-[#A5D6A7]",
          label: "Nhẹ",
        };
      default:
        return {
          color: "text-[#1976D2]",
          bg: "bg-[#E3F2FD]",
          border: "border-[#BBDEFB]",
          label: "Bình thường",
        };
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] pb-20">
      <div className="mb-6">
        <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
          Chẩn đoán bệnh lúa
        </h1>
        <p className="mt-1 text-[14px] text-[#5C5C5C]">
          Tải lên ảnh lá lúa để AI phân tích và chẩn đoán bệnh
        </p>
      </div>

      {!file && (
        <div className="mb-6 rounded-xl border border-[#2F9E44]/20 bg-[#E6F4EA] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[#2F9E44]" />
              <h4 className="text-[14px] font-[600] text-[#1F6F2E]">
                Hướng dẫn chụp ảnh lá lúa rõ nét
              </h4>
            </div>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="cursor-pointer text-[12px] font-[500] text-[#2F9E44] underline hover:text-[#1F6F2E]"
            >
              {showExamples ? "Ẩn ảnh mẫu" : "Xem ảnh mẫu"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="flex items-start gap-2">
              <Sun className="mt-0.5 h-4 w-4 shrink-0 text-[#2F9E44]" />
              <p className="text-[12px] text-[#1B1B1B]">
                Chụp ngoài trời, đủ ánh sáng tự nhiên
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Maximize className="mt-0.5 h-4 w-4 shrink-0 text-[#2F9E44]" />
              <p className="text-[12px] text-[#1B1B1B]">
                Chụp gần, rõ vết bệnh trên lá (15-30cm)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-[#2F9E44]" />
              <p className="text-[12px] text-[#1B1B1B]">
                Tránh chụp khi lá ướt sương hoặc mưa
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-[#2F9E44]" />
              <p className="text-[12px] text-[#1B1B1B]">
                Đặt lá trên nền phẳng nếu có thể
              </p>
            </div>
          </div>
        </div>
      )}

      {showExamples && !file && (
        <div className="mb-6 rounded-xl border border-[#E0E0E0] bg-white p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#2F9E44]" />
                <h5 className="text-[14px] font-[600] text-[#2F9E44]">
                  Ảnh tốt — AI phân tích chính xác
                </h5>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {goodExamples.map((ex, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-lg border-2 border-[#2F9E44]/30"
                  >
                    <ImageWithFallback
                      src={ex.url}
                      alt={ex.label}
                      className="h-[120px] w-full object-cover"
                    />
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 p-2">
                      <p className="text-[11px] text-white">{ex.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-[#E53935]" />
                <h5 className="text-[14px] font-[600] text-[#E53935]">
                  Ảnh xấu — Kết quả không chính xác
                </h5>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {badExamples.map((ex, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-lg border-2 border-[#E53935]/30"
                  >
                    <ImageWithFallback
                      src={ex.url}
                      alt={ex.label}
                      className="h-[120px] w-full object-cover"
                    />
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 p-2">
                      <p className="text-[11px] text-white">{ex.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#FB8C00] bg-[#FFF8E1] p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#FB8C00]" />
          <p className="text-[14px] font-[500] text-[#F57C00]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
              className={`flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${isDragging ? "border-[#2F9E44] bg-[#E6F4EA]" : "border-[#E0E0E0] bg-white hover:border-[#2F9E44] hover:bg-[#E6F4EA]/30"}`}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
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
              {/* Image Comparison: Original vs Annotated */}
              {result?.annotated_image ? (
                <div className="relative flex flex-col">
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-0 border-b border-[#E0E0E0]">
                    {/* Original Image */}
                    <div className="relative border-r border-[#E0E0E0]">
                      <div className="absolute top-2 left-2 z-10 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                        <span className="text-[11px] font-[600] tracking-wide text-white uppercase">
                          Ảnh gốc
                        </span>
                      </div>
                      <div className="flex aspect-square w-full items-center justify-center bg-black/5 p-2">
                        <img
                          src={file.url}
                          alt="Original"
                          className="max-h-full max-w-full rounded-lg object-contain"
                        />
                      </div>
                    </div>
                    {/* Annotated Image with Mask */}
                    <div className="relative">
                      <div className="absolute top-2 left-2 z-10 rounded-md bg-[#E53935]/90 px-2 py-0.5 backdrop-blur-sm">
                        <span className="text-[11px] font-[600] tracking-wide text-white uppercase">
                          AI phát hiện
                        </span>
                      </div>
                      <div className="flex aspect-square w-full items-center justify-center bg-black/5 p-2">
                        <img
                          src={`data:image/png;base64,${result.annotated_image}`}
                          alt="AI Detection"
                          className="max-h-full max-w-full rounded-lg object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative flex aspect-video w-full items-center justify-center bg-black/5 p-2">
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
              )}

              <div className="border-t border-[#E0E0E0] bg-[#FAFAFA] p-4">
                <label className="mb-2 block text-[13px] font-[500] text-[#1B1B1B]">
                  Mô tả triệu chứng (Tùy chọn)
                </label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`h-7 cursor-pointer rounded-full px-2.5 text-[12px] font-[500] transition-colors ${selectedTags.includes(tag) ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
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

        <div>
          <div className="flex h-full flex-col rounded-xl border border-[#E0E0E0] bg-white">
            <div className="border-b border-[#E0E0E0] p-5">
              <h3 className="text-[18px] font-[600] text-[#1B1B1B]">
                Kết quả chẩn đoán
              </h3>
            </div>
            <div className="flex flex-1 flex-col p-5">
              {!result ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F2F5]">
                    <Search className="h-8 w-8 text-[#9E9E9E]" />
                  </div>
                  <p className="max-w-[200px] text-[14px] text-[#5C5C5C]">
                    Kết quả sẽ hiển thị tại đây sau khi bạn tải ảnh lên
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {isHealthy ? (
                    <div
                      className={`mb-6 rounded-xl border border-[#2F9E44]/30 bg-[#E6F4EA] p-4`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[12px] font-[600] tracking-wider text-[#5C5C5C] uppercase">
                          Tình trạng
                        </span>
                        <div className="rounded border border-[#A5D6A7] bg-[#E6F4EA] px-2 py-0.5 text-[12px] font-[600] text-[#2F9E44]">
                          ✅ Khỏe mạnh
                        </div>
                      </div>
                      <h2
                        className={`mb-3 text-[24px] font-[700] text-[#1F6F2E]`}
                      >
                        {result.disease_name}
                      </h2>
                      <div className="flex items-center gap-3 rounded-lg bg-white/60 p-3">
                        <span className="text-[13px] font-[500] text-[#5C5C5C]">
                          Độ chính xác:
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E0E0E0]">
                          <div
                            className={`h-full bg-[#2F9E44]`}
                            style={{
                              width: `${Math.round(result.confidence * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-[14px] font-[700] text-[#1B1B1B]">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 space-y-4">
                      {(result.detections && result.detections.length > 0
                        ? result.detections
                        : [
                            {
                              disease: result.disease_name,
                              confidence: result.confidence,
                            },
                          ]
                      ).map((det, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm transition-all hover:border-[#FB8C00]/30"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-[600] tracking-wider text-[#9E9E9E] uppercase">
                              Phát hiện #{i + 1}
                            </span>
                            <div className="flex items-center gap-1.5 text-[12px] font-[600] text-[#FB8C00]">
                              <Info className="h-3.5 w-3.5" /> AI Phân tích
                            </div>
                          </div>
                          <h2 className="mb-3 text-[20px] font-[700] text-[#E65100]">
                            {det.disease}
                          </h2>
                          <div className="flex items-center gap-3 rounded-lg border border-[#F0F2F5] bg-[#FAFAFA] p-2.5">
                            <span className="text-[12px] font-[500] text-[#5C5C5C]">
                              Độ tin cậy:
                            </span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E0E0E0]">
                              <div
                                className="h-full bg-[#FB8C00]"
                                style={{
                                  width: `${Math.round(det.confidence * 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-[13px] font-[700] text-[#1B1B1B]">
                              {Math.round(det.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Overall Severity Assessment */}
                      <div
                        className={`rounded-lg border p-3 ${getSeverityStyle(result.severity).bg} ${getSeverityStyle(result.severity).border} flex items-center justify-between shadow-sm`}
                      >
                        <div className="flex items-center gap-2">
                          <Maximize className="h-4 w-4 text-[#5C5C5C]" />
                          <span className="text-[13px] font-[600] text-[#5C5C5C]">
                            Đánh giá mức độ tổng thể:
                          </span>
                        </div>
                        <span
                          className={`rounded px-2.5 py-1 text-[13px] font-[800] ${getSeverityStyle(result.severity).color}`}
                        >
                          {getSeverityStyle(
                            result.severity,
                          ).label.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  {!isHealthy && (
                    <div className="space-y-5">
                      {result.rag_recommendation ? (
                        <div className="space-y-4">
                          {/* Immediate Actions */}
                          {result.rag_recommendation.immediate_actions &&
                            result.rag_recommendation.immediate_actions.length >
                              0 && (
                              <div>
                                <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
                                  <CheckCircle className="h-4 w-4 text-[#2F9E44]" />{" "}
                                  Hành động khẩn cấp
                                </h4>
                                <ul className="space-y-2 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
                                  {result.rag_recommendation.immediate_actions.map(
                                    (item, i) => (
                                      <li
                                        key={i}
                                        className="flex gap-2 text-[14px] leading-[1.5] text-[#5C5C5C]"
                                      >
                                        <span className="mt-0.5 text-[#E53935]">
                                          •
                                        </span>{" "}
                                        <span>{item}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                          {/* Treatment Protocol */}
                          {result.rag_recommendation.treatment_protocol && (
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
                                <Droplets className="h-4 w-4 text-[#2F9E44]" />{" "}
                                Phác đồ điều trị
                              </h4>
                              <div className="space-y-3 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
                                {result.rag_recommendation.treatment_protocol
                                  .chemical &&
                                  result.rag_recommendation.treatment_protocol
                                    .chemical !==
                                    "Không có dữ liệu trong tài liệu tham khảo" && (
                                    <div>
                                      <strong className="text-[13px] text-[#1B1B1B]">
                                        Hóa học:
                                      </strong>
                                      <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                                        {
                                          result.rag_recommendation
                                            .treatment_protocol.chemical
                                        }
                                      </p>
                                    </div>
                                  )}
                                {result.rag_recommendation.treatment_protocol
                                  .biological &&
                                  result.rag_recommendation.treatment_protocol
                                    .biological !==
                                    "Không có dữ liệu trong tài liệu tham khảo" && (
                                    <div>
                                      <strong className="text-[13px] text-[#1B1B1B]">
                                        Sinh học:
                                      </strong>
                                      <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                                        {
                                          result.rag_recommendation
                                            .treatment_protocol.biological
                                        }
                                      </p>
                                    </div>
                                  )}
                                {result.rag_recommendation.treatment_protocol
                                  .cultural &&
                                  result.rag_recommendation.treatment_protocol
                                    .cultural !==
                                    "Không có dữ liệu trong tài liệu tham khảo" && (
                                    <div>
                                      <strong className="text-[13px] text-[#1B1B1B]">
                                        Canh tác:
                                      </strong>
                                      <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                                        {
                                          result.rag_recommendation
                                            .treatment_protocol.cultural
                                        }
                                      </p>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          {/* NPK Adjustment */}
                          {result.rag_recommendation.npk_adjustment &&
                            result.rag_recommendation.npk_adjustment !==
                              "Không có dữ liệu trong tài liệu tham khảo" && (
                              <div>
                                <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
                                  <Leaf className="h-4 w-4 text-[#2F9E44]" />{" "}
                                  Điều chỉnh dinh dưỡng (NPK)
                                </h4>
                                <p className="rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3 text-[14px] leading-[1.6] text-[#5C5C5C]">
                                  {result.rag_recommendation.npk_adjustment}
                                </p>
                              </div>
                            )}

                          {/* Prevention Measures */}
                          {result.rag_recommendation.prevention_measures &&
                            result.rag_recommendation.prevention_measures
                              .length > 0 && (
                              <div>
                                <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
                                  <Sun className="h-4 w-4 text-[#2F9E44]" />{" "}
                                  Biện pháp phòng ngừa
                                </h4>
                                <ul className="space-y-2 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
                                  {result.rag_recommendation.prevention_measures.map(
                                    (item, i) => (
                                      <li
                                        key={i}
                                        className="flex gap-2 text-[14px] leading-[1.5] text-[#5C5C5C]"
                                      >
                                        <span className="mt-0.5 text-[#2F9E44]">
                                          •
                                        </span>{" "}
                                        <span>{item}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] p-6 text-center">
                          <Info className="mb-2 h-8 w-8 text-[#9E9E9E]" />
                          <p className="text-[14px] text-[#5C5C5C]">
                            Không có hướng dẫn chi tiết cho bệnh này hoặc kết
                            nối hệ thống AI đang bị lỗi.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#2F9E44] px-4 text-[14px] font-[500] text-[#2F9E44] transition-colors hover:bg-[#E6F4EA]">
                      Xem chi tiết phác đồ <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
