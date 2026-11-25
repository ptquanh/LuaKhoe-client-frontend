"use client";

import { ArrowLeft, ScanLine } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { DiagnosisResponse } from "@/types/diagnose.type";

import { DiagnosisFeedbackCard } from "./components/DiagnosisFeedbackCard";
import { NutritionAdjustmentCard } from "./components/NutritionAdjustmentCard";
import { PreventionMeasuresCard } from "./components/PreventionMeasuresCard";
import {
  ResultErrorState,
  ResultSkeleton,
  ResultSourcesCard,
  ResultSupplementBanner,
} from "./components/ResultAuxCards";
import { ResultContextCard } from "./components/ResultContextCard";
import {
  DetectionResultItem,
  ResultDetectionsCard,
} from "./components/ResultDetectionsCard";
import { ResultHeroCard } from "./components/ResultHeroCard";
import { ResultImagePreview } from "./components/ResultImagePreview";
import { TreatmentProtocolCard } from "./components/TreatmentProtocolCard";
import { UrgentActionsCard } from "./components/UrgentActionsCard";
import { useDiagnosisResult } from "./components/useDiagnosisResult";

const HEALTHY_DEFAULT_TIPS = [
  "Thăm đồng định kỳ 3–5 ngày/lần để phát hiện sớm dấu hiệu sâu bệnh mới phát sinh.",
  "Duy trì mực nước ruộng hợp lý theo từng giai đoạn sinh trưởng, tránh ngập úng kéo dài.",
  "Bón phân cân đối N-P-K theo bảng so màu lá, hạn chế bón thừa đạm vào giai đoạn làm đòng.",
];

function ResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user: currentUser } = useAuth();

  const {
    loading,
    error,
    data,
    existingFeedback,
    diseases,
    checkedActions,
    toggleCheck,
    handleFeedbackSubmit,
  } = useDiagnosisResult(id);

  if (loading) return <ResultSkeleton />;

  if (error || !data) {
    return (
      <ResultErrorState
        error={error}
        onBack={() => router.push(ROUTES.DIAGNOSE)}
      />
    );
  }

  const rag = data.rag_recommendation;
  const diseaseName = data.disease_name || data.disease_key || "Không xác định";
  const isHealthy =
    diseaseName.toLowerCase().includes("healthy") ||
    diseaseName.toLowerCase().includes("khỏe mạnh") ||
    diseaseName.toLowerCase().includes("bình thường") ||
    data.disease_key === "Healthy";
  const severityKey = data.severity || "medium";
  const confVal = data.confidence
    ? data.confidence > 1
      ? Math.round(data.confidence)
      : Math.round(data.confidence * 100)
    : 0;

  const detections = (data.results || []) as DetectionResultItem[];
  const detectedDiseaseIds =
    data.results?.map((r) => r.diseaseId).filter(Boolean) || [];
  const maxAffectedArea = detections.reduce(
    (max, item) => Math.max(max, Number(item.affectedAreaRatio || 0)),
    0,
  );
  const urgentActions = rag?.immediate_actions || [];
  const canSubmitFeedback = Boolean(
    currentUser && data && currentUser.id === data.userId,
  );

  const quickJumpLinks = [
    { href: "#overview", label: "Tổng quan" },
    ...(detections.length > 0
      ? [{ href: "#detections", label: "Phát hiện" }]
      : []),
    ...(urgentActions.length > 0
      ? [{ href: "#urgent", label: "Xử lý ngay" }]
      : []),
    { href: "#protocol", label: "Phác đồ" },
    { href: "#nutrition", label: "Dinh dưỡng" },
    { href: "#prevention", label: "Phòng ngừa" },
    ...(canSubmitFeedback ? [{ href: "#feedback", label: "Đánh giá" }] : []),
  ];

  const aiModelVersion =
    (data as DiagnosisResponse & { aiModel?: { versionName?: string } }).aiModel
      ?.versionName || null;

  return (
    <div className="mx-auto max-w-[1180px] pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(ROUTES.HISTORY)}
          className="text-text-secondary hover:text-text-primary flex min-h-10 cursor-pointer items-center gap-1.5 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại lịch sử
        </button>

        <button
          type="button"
          onClick={() => router.push(ROUTES.DIAGNOSE)}
          className="border-border bg-bg-card text-text-primary hover:border-primary hover:text-primary flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold shadow-xs transition-colors sm:text-sm"
        >
          <ScanLine className="h-4 w-4" /> Chẩn đoán mới
        </button>
      </div>

      {!isHealthy && (
        <nav
          aria-label="Điều hướng nhanh kết quả"
          className="scrollbar-hide border-border bg-bg-page/90 sticky top-14 z-30 -mx-4 mb-5 flex items-center gap-2 overflow-x-auto border-b px-4 py-2.5 backdrop-blur-md sm:top-16 sm:mx-0 sm:rounded-xl sm:border sm:px-3"
        >
          {quickJumpLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-border bg-bg-card text-text-secondary hover:border-primary hover:text-primary shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div id="overview" className="scroll-mt-32 lg:col-span-7">
          <ResultHeroCard
            diseaseName={diseaseName}
            severity={severityKey}
            confidence={confVal}
            isHealthy={isHealthy}
            severityAssessment={rag?.severity_assessment}
            summary={rag?.summary}
            createdAt={data.createdAt}
            province={data.province}
            detectionsCount={detections.length}
            maxAffectedArea={maxAffectedArea}
          />
        </div>

        <div id="images" className="scroll-mt-32 lg:col-span-5">
          <ResultImagePreview
            originalImageUrl={data.originalImageUrl}
            resultImageUrl={
              data.resultImageUrl || data.annotated_image || undefined
            }
            supplementImageUrl={data.supplementImageUrl || undefined}
            diseaseName={diseaseName}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {data.supplementImageUrl && <ResultSupplementBanner />}

          {!isHealthy ? (
            <>
              {detections.length > 0 && (
                <div id="detections" className="scroll-mt-32">
                  <ResultDetectionsCard results={detections} />
                </div>
              )}

              {urgentActions.length > 0 && (
                <div id="urgent" className="scroll-mt-32">
                  <UrgentActionsCard
                    urgentActions={urgentActions}
                    checkedActions={checkedActions}
                    onToggleAction={toggleCheck}
                  />
                </div>
              )}

              <div id="protocol" className="scroll-mt-32">
                <TreatmentProtocolCard
                  chemicalSteps={rag?.treatment_protocol?.chemical}
                  biologicalSteps={rag?.treatment_protocol?.biological}
                  cultivationSteps={
                    rag?.treatment_protocol?.cultural ||
                    (
                      rag?.treatment_protocol as
                        | { cultivation?: string | string[] }
                        | undefined
                    )?.cultivation
                  }
                />
              </div>

              <div id="nutrition" className="scroll-mt-32">
                <NutritionAdjustmentCard npkAdjustment={rag?.npk_adjustment} />
              </div>

              <div id="prevention" className="scroll-mt-32">
                <PreventionMeasuresCard
                  preventionMeasures={rag?.prevention_measures}
                />
              </div>
            </>
          ) : (
            <PreventionMeasuresCard
              title="Khuyến nghị duy trì lúa khỏe"
              subtitle="Các bước chăm sóc định kỳ để giữ ruộng lúa ổn định và phòng ngừa sớm"
              preventionMeasures={
                rag?.prevention_measures?.length
                  ? rag.prevention_measures
                  : HEALTHY_DEFAULT_TIPS
              }
            />
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-4">
          <ResultContextCard
            province={data.province}
            createdAt={data.createdAt}
            weatherData={data.weatherData}
            envDescription={data.envDescription}
            fieldDescription={data.fieldDescription}
            aiModelVersion={aiModelVersion}
          />

          {canSubmitFeedback && (
            <div id="feedback" className="scroll-mt-32">
              <DiagnosisFeedbackCard
                onSubmitFeedback={handleFeedbackSubmit}
                existingFeedback={existingFeedback}
                diseases={diseases}
                detectedDiseaseIds={detectedDiseaseIds}
              />
            </div>
          )}

          <ResultSourcesCard
            sourcesUsed={rag?.sources_used}
            confidenceNote={rag?.confidence_note}
          />
        </aside>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultPageContent />
    </Suspense>
  );
}
