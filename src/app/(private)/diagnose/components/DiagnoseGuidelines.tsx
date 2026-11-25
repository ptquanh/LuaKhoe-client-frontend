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
      <div className="border-primary-border bg-primary-light/60 mb-6 rounded-2xl border p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="text-primary h-5 w-5 shrink-0" />
            <h4 className="font-heading text-primary-dark dark:text-primary text-sm font-semibold">
              Hướng dẫn chụp ảnh lá lúa rõ nét
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="text-primary hover:text-primary-hover min-h-9 cursor-pointer px-1 text-xs font-semibold underline underline-offset-2"
          >
            {showExamples ? "Ẩn ảnh mẫu" : "Xem ảnh mẫu"}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex items-start gap-2">
            <Sun className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-text-primary text-xs leading-relaxed">
              Chụp ngoài trời, đủ ánh sáng tự nhiên
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Maximize className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-text-primary text-xs leading-relaxed">
              Chụp gần, rõ vết bệnh trên lá (15-30cm)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Droplets className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-text-primary text-xs leading-relaxed">
              Tránh chụp khi lá ướt sương hoặc mưa
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Leaf className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-text-primary text-xs leading-relaxed">
              Đặt lá trên nền phẳng nếu có thể
            </p>
          </div>
        </div>
      </div>

      {showExamples && (
        <div className="border-border bg-bg-card mb-6 rounded-2xl border p-4 shadow-xs">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle className="text-success h-5 w-5" />
                <h5 className="font-heading text-success text-sm font-semibold">
                  Ảnh tốt — AI phân tích chính xác
                </h5>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {goodExamples.map((ex, i) => (
                  <div
                    key={i}
                    className="border-primary-border relative overflow-hidden rounded-xl border-2"
                  >
                    <ImageWithFallback
                      src={ex.url}
                      alt={ex.label}
                      className="h-[120px] w-full object-cover"
                    />
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/75 p-2">
                      <p className="text-xs font-medium text-white">
                        {ex.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <XCircle className="text-error h-5 w-5" />
                <h5 className="font-heading text-error text-sm font-semibold">
                  Ảnh xấu — Kết quả không chính xác
                </h5>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {badExamples.map((ex, i) => (
                  <div
                    key={i}
                    className="border-error/35 relative overflow-hidden rounded-xl border-2"
                  >
                    <ImageWithFallback
                      src={ex.url}
                      alt={ex.label}
                      className="h-[120px] w-full object-cover"
                    />
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/75 p-2">
                      <p className="text-xs font-medium text-white">
                        {ex.label}
                      </p>
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
