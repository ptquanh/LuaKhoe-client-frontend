"use client";

import { ShieldCheck } from "lucide-react";
import React from "react";

interface PreventionMeasuresCardProps {
  preventionMeasures?: string[];
  defaultPrevention: string;
}

export function PreventionMeasuresCard({
  preventionMeasures,
  defaultPrevention,
}: PreventionMeasuresCardProps) {
  const measures = preventionMeasures?.length
    ? preventionMeasures
    : defaultPrevention
        .split(/\n|(?<=\.)\s+/)
        .filter((s) => s.trim().length > 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
            Biện pháp phòng ngừa vụ sau
          </h3>
          <p className="text-[13px] text-[#757575]">
            Chuẩn bị kỹ lưỡng để tránh bệnh tái phát trong tương lai
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
        {measures.map((measure, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-[#E0E0E0]/60 bg-[#F7F7F7]/50 p-3.5 text-[14px] leading-[1.6] text-[#5C5C5C]"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1976D2]/10 text-[12px] font-[700] text-[#1976D2]">
              ✓
            </span>
            <span className="flex-1 font-[500] text-[#1B1B1B]">{measure}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
