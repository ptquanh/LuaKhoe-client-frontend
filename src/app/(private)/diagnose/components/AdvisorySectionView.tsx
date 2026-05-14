import { CheckCircle, Info } from "lucide-react";
import React from "react";

import { LegacyRagRecommendation } from "./LegacyRagRecommendation";
import { renderMarkdown } from "./MarkdownRenderer";

interface AdvisorySectionViewProps {
  advisoryData: any;
  ragRecommendation: any;
}

export function AdvisorySectionView({
  advisoryData,
  ragRecommendation,
}: AdvisorySectionViewProps) {
  const adv = advisoryData?.advisory;

  if (adv && typeof adv === "object") {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] p-5 shadow-sm">
          <h4 className="mb-4 flex items-center gap-2 text-[16px] font-[700] text-[#1B1B1B]">
            <CheckCircle className="h-5 w-5 text-[#2F9E44]" /> Lời khuyên từ
            Chuyên gia AI
          </h4>
          {adv.summary && renderMarkdown(adv.summary)}
        </div>
        <LegacyRagRecommendation recommendation={adv} />
      </div>
    );
  }

  if (adv && typeof adv === "string") {
    return (
      <div className="rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] p-5 shadow-sm">
        <h4 className="mb-4 flex items-center gap-2 text-[16px] font-[700] text-[#1B1B1B]">
          <CheckCircle className="h-5 w-5 text-[#2F9E44]" /> Khuyến nghị từ
          Chuyên gia AI
        </h4>
        {renderMarkdown(adv)}
      </div>
    );
  }

  if (ragRecommendation) {
    return <LegacyRagRecommendation recommendation={ragRecommendation} />;
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] p-6 text-center">
      <Info className="mb-2 h-8 w-8 text-[#9E9E9E]" />
      <p className="text-[14px] text-[#5C5C5C]">
        Không có hướng dẫn chi tiết cho bệnh này hoặc kết nối hệ thống AI đang
        bị lỗi.
      </p>
    </div>
  );
}
