interface HealthyResultViewProps {
  diseaseName: string;
  confidencePercent: number;
}

export function HealthyResultView({
  diseaseName,
  confidencePercent,
}: HealthyResultViewProps) {
  return (
    <div className="mb-6 rounded-xl border border-[#2F9E44]/30 bg-[#E6F4EA] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-[600] tracking-wider text-[#5C5C5C] uppercase">
          Tình trạng
        </span>
        <div className="rounded border border-[#A5D6A7] bg-[#E6F4EA] px-2 py-0.5 text-[12px] font-[600] text-[#2F9E44]">
          ✅ Khỏe mạnh
        </div>
      </div>
      <h2 className="mb-3 text-[24px] font-[700] text-[#1F6F2E]">
        {diseaseName}
      </h2>
      <div className="flex items-center gap-3 rounded-lg bg-white/60 p-3">
        <span className="text-[13px] font-[500] text-[#5C5C5C]">
          Độ chính xác:
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E0E0E0]">
          <div
            className="h-full bg-[#2F9E44]"
            style={{
              width: `${confidencePercent}%`,
            }}
          />
        </div>
        <span className="text-[14px] font-[700] text-[#1B1B1B]">
          {confidencePercent}%
        </span>
      </div>
    </div>
  );
}
