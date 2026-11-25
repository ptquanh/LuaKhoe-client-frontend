import { CheckCircle, Info } from "lucide-react";

import { LegacyRagRecommendation } from "@/components/diagnosis/LegacyRagRecommendation";

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
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5 shadow-xs">
          <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
            <CheckCircle className="h-5 w-5 text-[var(--primary)]" /> Lời khuyên
            từ Chuyên gia AI
          </h4>
          {adv.summary && renderMarkdown(adv.summary)}
        </div>
        <LegacyRagRecommendation recommendation={adv} />
      </div>
    );
  }

  if (adv && typeof adv === "string") {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
          <CheckCircle className="h-5 w-5 text-[var(--primary)]" /> Khuyến nghị
          từ Chuyên gia AI
        </h4>
        {renderMarkdown(adv)}
      </div>
    );
  }

  if (ragRecommendation) {
    return <LegacyRagRecommendation recommendation={ragRecommendation} />;
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 text-center">
      <Info className="mb-2 h-8 w-8 text-[var(--text-muted)]" />
      <p className="text-sm text-[var(--text-secondary)]">
        Không có hướng dẫn chi tiết cho bệnh này hoặc kết nối hệ thống AI đang
        bị lỗi.
      </p>
    </div>
  );
}
