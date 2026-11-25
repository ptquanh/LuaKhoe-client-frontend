import { CheckCircle2 } from "lucide-react";

interface HealthyResultViewProps {
  diseaseName: string;
  confidencePercent: number;
}

export function HealthyResultView({ diseaseName }: HealthyResultViewProps) {
  return (
    <div className="mb-6 rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          Tình trạng
        </span>
        <div className="inline-flex items-center gap-1 rounded-full border border-[var(--primary-border)] bg-[var(--bg-card)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          Khỏe mạnh
        </div>
      </div>
      <h2 className="mb-1 text-2xl font-bold text-[var(--primary)]">
        {diseaseName}
      </h2>
    </div>
  );
}
