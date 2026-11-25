"use client";

import { Lightbulb, Sprout } from "lucide-react";

interface NutritionAdjustmentCardProps {
  npkAdjustment?: string;
}

export function NutritionAdjustmentCard({
  npkAdjustment,
}: NutritionAdjustmentCardProps) {
  return (
    <section className="border-border bg-bg-card rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="border-border mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
        <div className="flex items-center gap-3">
          <div className="bg-primary-soft text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-text-primary text-base font-bold sm:text-lg">
              Điều chỉnh dinh dưỡng N-P-K
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm">
              Cân đối phân bón giúp cây lúa phục hồi và tăng sức đề kháng
            </p>
          </div>
        </div>
        <span className="border-primary-border bg-primary-soft text-primary rounded-full border px-3 py-1 font-mono text-xs font-bold">
          N · P · K
        </span>
      </div>

      {npkAdjustment ? (
        <div className="border-primary bg-primary-soft/45 flex items-start gap-3 rounded-r-xl border-l-[3px] p-4">
          <span className="bg-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
            <Lightbulb className="h-3.5 w-3.5" />
          </span>
          <div className="text-text-primary text-sm leading-relaxed sm:text-[15px]">
            <span className="text-primary font-bold">Khuyến nghị: </span>
            {npkAdjustment}
          </div>
        </div>
      ) : (
        <div className="border-border bg-bg-subtle/40 text-text-secondary rounded-xl border border-dashed p-4 text-sm italic">
          Chưa có khuyến nghị điều chỉnh dinh dưỡng cụ thể cho chẩn đoán này.
        </div>
      )}
    </section>
  );
}
