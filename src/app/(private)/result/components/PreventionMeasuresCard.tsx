"use client";

import { Check, ShieldCheck } from "lucide-react";

interface PreventionMeasuresCardProps {
  preventionMeasures?: string[];
  title?: string;
  subtitle?: string;
}

export function PreventionMeasuresCard({
  preventionMeasures,
  title = "Biện pháp phòng ngừa vụ sau",
  subtitle = "Chuẩn bị kỹ lưỡng để hạn chế bệnh tái phát trong các vụ tiếp theo",
}: PreventionMeasuresCardProps) {
  const measures = preventionMeasures?.length ? preventionMeasures : [];

  return (
    <section className="border-border bg-bg-card overflow-hidden rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="border-border mb-4 flex items-center gap-3 border-b pb-3.5">
        <div className="bg-info/15 text-info flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-text-primary text-base font-bold sm:text-lg">
            {title}
          </h3>
          <p className="text-text-secondary text-xs sm:text-sm">{subtitle}</p>
        </div>
      </div>

      {measures.length === 0 ? (
        <div className="border-border bg-bg-subtle/40 text-text-secondary rounded-xl border border-dashed p-4 text-sm italic">
          Chưa có thông tin biện pháp phòng ngừa cụ thể cho trường hợp này.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {measures.map((measure, i) => (
            <li
              key={i}
              className="border-border bg-bg-subtle/60 flex items-start gap-3 rounded-xl border p-3.5 text-sm leading-relaxed"
            >
              <span className="bg-info/15 text-info mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span className="text-text-primary flex-1 font-medium">
                {measure}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
