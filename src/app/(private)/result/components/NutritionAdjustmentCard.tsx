"use client";

import React from "react";

interface NutritionAdjustmentCardProps {
  npkAdjustment?: string;
  defaultNpk: {
    current: string;
    recommendation: string;
  };
}

export function NutritionAdjustmentCard({
  npkAdjustment,
  defaultNpk,
}: NutritionAdjustmentCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#2F9E44] bg-gradient-to-br from-[#E6F4EA] to-[#F1F8F5] p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2F9E44] shadow-sm">
          <span className="text-[17px] font-[800] text-white">NPK</span>
        </div>
        <div>
          <h3 className="text-[19px] font-[800] text-[#1F6F2E]">
            Điều chỉnh dinh dưỡng N-P-K
          </h3>
          <p className="text-[13px] font-[500] text-[#2E7D32]/80">
            Cân đối phân bón giúp lúa phục hồi nhanh và kháng bệnh tốt
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-[#2F9E44]/20 bg-white/80 p-4.5 shadow-sm backdrop-blur-sm">
        {npkAdjustment ? (
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F9E44]/10 text-[14px] text-[#2F9E44]">
              💡
            </span>
            <div className="text-[15px] leading-[1.6] text-[#1B1B1B]">
              <span className="font-[700] text-[#1F6F2E]">
                Khuyến nghị từ chuyên gia:
              </span>{" "}
              {npkAdjustment}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 border-b border-[#2F9E44]/10 pb-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[14px] text-amber-800">
                ⚠️
              </span>
              <div className="text-[15px] leading-[1.6] text-[#1B1B1B]">
                <span className="font-[700] text-amber-900">
                  Tình trạng dinh dưỡng hiện tại:
                </span>{" "}
                {defaultNpk.current}
              </div>
            </div>
            <div className="flex items-start gap-3 pt-1">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F9E44]/10 text-[14px] text-[#2F9E44]">
                💡
              </span>
              <div className="text-[15px] leading-[1.6] text-[#1B1B1B]">
                <span className="font-[700] text-[#1F6F2E]">
                  Khuyến nghị từ chuyên gia:
                </span>{" "}
                {defaultNpk.recommendation}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
