import {
  CheckCircle,
  Droplets,
  Info,
  Leaf,
  Maximize,
  Sun,
  XCircle,
} from "lucide-react";
import React from "react";

import { ImageWithFallback } from "@/components/ImageWithFallback";

interface DiagnoseGuidelinesProps {
  showExamples: boolean;
  setShowExamples: (val: boolean) => void;
}

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

export function DiagnoseGuidelines({
  showExamples,
  setShowExamples,
}: DiagnoseGuidelinesProps) {
  return (
    <>
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

      {showExamples && (
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
    </>
  );
}
