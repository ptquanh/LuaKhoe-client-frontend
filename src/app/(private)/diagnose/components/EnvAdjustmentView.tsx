import {
  CloudRain,
  Droplets,
  Info,
  Lightbulb,
  Thermometer,
  Wind,
} from "lucide-react";

import { EnvAdjustment } from "@/types/diagnose.type";

interface EnvAdjustmentViewProps {
  adjustment: EnvAdjustment;
}

export function EnvAdjustmentView({ adjustment }: EnvAdjustmentViewProps) {
  if (!adjustment || !adjustment.applied) return null;

  const { weather } = adjustment;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xs">
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3">
        <Info className="h-4 w-4 text-[var(--primary)]" />
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">
          Yếu tố môi trường & Thời tiết
        </h4>
      </div>

      <div className="p-4">
        {/* Weather Grid */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl bg-amber-500/10 p-3">
            <Thermometer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase">
                Nhiệt độ
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
                {weather.temperature}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-sky-500/10 p-3">
            <Droplets className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div>
              <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase">
                Độ ẩm
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
                {weather.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-cyan-500/10 p-3">
            <CloudRain className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <div>
              <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase">
                Lượng mưa
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)] capitalize">
                {weather.rainfall === "none"
                  ? "Không"
                  : weather.rainfall === "light"
                    ? "Nhẹ"
                    : "To"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[var(--primary-soft)] p-3">
            <Wind className="h-5 w-5 text-[var(--primary)]" />
            <div>
              <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase">
                Sức gió
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)] capitalize">
                {weather.wind === "calm"
                  ? "Lặng"
                  : weather.wind === "moderate"
                    ? "Vừa"
                    : "Mạnh"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)]/60 p-3 text-xs leading-relaxed text-[var(--text-primary)]">
          <p className="mb-1 flex items-center gap-1.5 font-semibold text-[var(--primary)]">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" /> Phân tích
            của AI:
          </p>
          Dựa trên điều kiện thời tiết tại địa phương (
          {weather.source === "api" ? "Dữ liệu Open-Meteo" : "Dữ liệu mặc định"}
          ) và thông số thực địa bạn cung cấp, AI đã tự động điều chỉnh độ tin
          cậy để đưa ra kết quả chính xác nhất.
        </div>
      </div>
    </div>
  );
}
