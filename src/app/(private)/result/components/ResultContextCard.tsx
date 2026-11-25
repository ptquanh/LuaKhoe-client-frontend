"use client";

import {
  CalendarClock,
  CloudRain,
  CloudSun,
  Cpu,
  Droplets,
  FileText,
  MapPin,
  Sprout,
  Thermometer,
  Wind,
} from "lucide-react";

interface ResultContextCardProps {
  province?: string | null;
  createdAt?: string | null;
  weatherData?: Record<
    string,
    string | number | boolean | null | undefined
  > | null;
  envDescription?: string | null;
  fieldDescription?: string | null;
  aiModelVersion?: string | null;
}

function formatScanDate(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ResultContextCard({
  province,
  createdAt,
  weatherData,
  envDescription,
  fieldDescription,
  aiModelVersion,
}: ResultContextCardProps) {
  const temp = weatherData?.temperature ?? weatherData?.temp;
  const humidity = weatherData?.humidity;
  const rainfall = weatherData?.rainfall;
  const wind = weatherData?.wind;

  const weatherTiles = [
    temp !== undefined && temp !== null && temp !== ""
      ? {
          label: "Nhiệt độ",
          value: typeof temp === "number" ? `${temp}°C` : String(temp),
          icon: Thermometer,
        }
      : null,
    humidity !== undefined && humidity !== null && humidity !== ""
      ? {
          label: "Độ ẩm",
          value:
            typeof humidity === "number" ? `${humidity}%` : String(humidity),
          icon: Droplets,
        }
      : null,
    rainfall !== undefined && rainfall !== null && rainfall !== ""
      ? {
          label: "Lượng mưa",
          value: String(rainfall),
          icon: CloudRain,
        }
      : null,
    wind !== undefined && wind !== null && wind !== ""
      ? {
          label: "Sức gió",
          value: String(wind),
          icon: Wind,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    icon: typeof Thermometer;
  }>;

  const formattedDate = formatScanDate(createdAt);

  const metaRows = [
    province ? { label: "Khu vực", value: province, icon: MapPin } : null,
    formattedDate
      ? { label: "Thời gian quét", value: formattedDate, icon: CalendarClock }
      : null,
    envDescription
      ? {
          label: "Điều kiện môi trường",
          value: envDescription,
          icon: Sprout,
        }
      : null,
    fieldDescription
      ? {
          label: "Ghi chú ruộng",
          value: fieldDescription,
          icon: FileText,
        }
      : null,
    aiModelVersion
      ? { label: "Phiên bản AI", value: aiModelVersion, icon: Cpu }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    icon: typeof MapPin;
  }>;

  if (weatherTiles.length === 0 && metaRows.length === 0) {
    return null;
  }

  return (
    <section className="border-border bg-bg-card space-y-4 rounded-2xl border p-5 shadow-xs">
      <div className="border-border flex items-center gap-3 border-b pb-3.5">
        <div className="bg-info/15 text-info flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <CloudSun className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="font-heading text-text-primary text-base font-bold">
            Bối cảnh ruộng & thời tiết
          </h3>
          <p className="text-text-secondary text-xs">
            Dữ liệu ghi nhận tại thời điểm quét mẫu
          </p>
        </div>
      </div>

      {weatherTiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5">
          {weatherTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.label}
                className="border-border bg-bg-subtle/70 rounded-xl border p-3"
              >
                <div className="text-text-muted mb-1 flex items-center gap-1.5 text-[11px] font-semibold">
                  <Icon className="text-primary h-3.5 w-3.5 shrink-0" />
                  <span>{tile.label}</span>
                </div>
                <p className="text-text-primary truncate text-sm font-bold tabular-nums">
                  {tile.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {metaRows.length > 0 && (
        <dl className="space-y-2.5 text-xs sm:text-sm">
          {metaRows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className="border-border/60 flex items-start justify-between gap-3 border-b pb-2 last:border-b-0 last:pb-0"
              >
                <dt className="text-text-secondary flex shrink-0 items-center gap-1.5 font-medium">
                  <Icon className="text-text-muted h-3.5 w-3.5 shrink-0" />
                  <span>{row.label}</span>
                </dt>
                <dd className="text-text-primary text-right font-semibold break-words">
                  {row.value}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}
