"use client";

import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes";
import { diagnosisService } from "@/services/diagnosis.service";
import { feedbackService } from "@/services/feedback.service";
import { DiagnosisResponse } from "@/types/diagnose.type";
import { FeedbackItem } from "@/types/feedback.type";

import { DiagnosisFeedbackCard } from "./components/DiagnosisFeedbackCard";
import { NutritionAdjustmentCard } from "./components/NutritionAdjustmentCard";
import { PreventionMeasuresCard } from "./components/PreventionMeasuresCard";
import { ResultHeroCard } from "./components/ResultHeroCard";
import { ResultImagePreview } from "./components/ResultImagePreview";
import { TreatmentProtocolCard } from "./components/TreatmentProtocolCard";
import { UrgentActionsCard } from "./components/UrgentActionsCard";

function ResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DiagnosisResponse | null>(null);
  const [existingFeedback, setExistingFeedback] = useState<FeedbackItem | null>(
    null,
  );

  const [checkedActions, setCheckedActions] = useState<boolean[]>([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Không tìm thấy ID chẩn đoán.");
      return;
    }

    const fetchDiagnosisAndFeedback = async () => {
      try {
        setLoading(true);
        setError(null);

        const [res, fbRes] = await Promise.all([
          diagnosisService.getById(id),
          feedbackService.getMyFeedbacks().catch(() => null),
        ]);

        if (res.success && res.data) {
          setData(res.data);
          const urgentCount =
            res.data.rag_recommendation?.immediate_actions?.length || 0;
          setCheckedActions(new Array(urgentCount).fill(false));
        } else {
          setError(res.message || "Không thể tải dữ liệu chẩn đoán.");
        }

        if (fbRes?.success && fbRes.data) {
          const found = fbRes.data.find((item) => item.diagnosisId === id);
          if (found) {
            setExistingFeedback(found);
          }
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosisAndFeedback();
  }, [id]);

  const toggleCheck = (index: number) => {
    setCheckedActions((prev) =>
      prev.map((val, i) => (i === index ? !val : val)),
    );
  };

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    if (!id) return;
    try {
      const prefix = rating > 0 ? `[Đánh giá: ${rating}/5 sao] ` : "";
      const userMessage = `${prefix}${comment}`;
      const res = await feedbackService.submit({
        diagnosisId: id,
        userMessage,
        actualDiseaseIds: [],
      });
      setExistingFeedback({
        id: res.data?.id || Date.now().toString(),
        diagnosisId: id,
        userId: "current",
        userMessage,
        actualDiseases: [],
        status: "PENDING",
        createdAt: new Date().toISOString(),
      });
      console.log("Feedback submitted successfully");
    } catch (err) {
      console.error("Lỗi gửi phản hồi:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FB8C00]" />
        <p className="text-[15px] font-[500] text-[#5C5C5C]">
          Đang tải dữ liệu chẩn đoán chi tiết...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-[900px] pt-6 pb-20">
        <button
          onClick={() => router.push(ROUTES.DIAGNOSE)}
          className="mb-6 flex cursor-pointer items-center gap-1 text-[14px] text-[#5C5C5C] hover:text-[#1B1B1B]"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h2 className="text-[18px] font-[700] text-red-800">
            Không tải được chẩn đoán
          </h2>
          <p className="text-[14px] text-red-600">
            {error || "Dữ liệu không tồn tại hoặc đã bị xóa."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-[14px] font-[500] text-white hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
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

  const urgentActions = rag?.immediate_actions || [];

  const previewImg =
    data.annotated_image || data.resultImageUrl || data.originalImageUrl || "";

  return (
    <div className="mx-auto max-w-[900px] px-4 pt-4 pb-20 md:px-0">
      <button
        onClick={() => router.push(ROUTES.HISTORY)}
        className="mb-6 flex cursor-pointer items-center gap-1 text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:text-[#1B1B1B]"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </button>

      <div className="space-y-6">
        {/* Hero Card */}
        <ResultHeroCard
          diseaseName={diseaseName}
          severity={severityKey}
          confidence={confVal}
          isHealthy={isHealthy}
        />

        {/* Urgent Actions */}
        {!isHealthy && urgentActions.length > 0 && (
          <UrgentActionsCard
            urgentActions={urgentActions}
            checkedActions={checkedActions}
            onToggleAction={toggleCheck}
          />
        )}

        {/* Treatment Protocol */}
        {!isHealthy && (
          <TreatmentProtocolCard
            chemicalSteps={rag?.treatment_protocol?.chemical}
            biologicalSteps={rag?.treatment_protocol?.biological}
            cultivationSteps={
              rag?.treatment_protocol?.cultural ||
              (rag?.treatment_protocol as any)?.cultivation
            }
          />
        )}

        {/* Nutrition Adjustment */}
        {!isHealthy && (
          <NutritionAdjustmentCard npkAdjustment={rag?.npk_adjustment} />
        )}

        {/* Prevention Measures */}
        {!isHealthy && (
          <PreventionMeasuresCard
            preventionMeasures={rag?.prevention_measures}
          />
        )}

        {/* Image Preview */}
        <ResultImagePreview imageUrl={previewImg} diseaseName={diseaseName} />

        {/* Feedback Card */}
        <DiagnosisFeedbackCard
          onSubmitFeedback={handleFeedbackSubmit}
          existingFeedback={existingFeedback}
        />

        {/* Footer Sources */}
        <div className="rounded-2xl border border-[#E0E0E0] bg-[#F7F7F7] p-5">
          <p className="mb-2 text-[13px] leading-[1.6] text-[#757575]">
            <span className="font-[700] text-[#5C5C5C]">Nguồn tham khảo:</span>{" "}
            {rag?.sources_used?.length
              ? rag.sources_used.join(", ")
              : "Hệ thống chuyên gia Lúa Khỏe, IRRI Rice Knowledge Bank"}
          </p>
          <p className="text-[13px] leading-[1.6] text-[#757575]">
            <span className="font-[700] text-[#5C5C5C]">Lưu ý:</span>{" "}
            {rag?.confidence_note ||
              "Độ tin cậy cao. Nếu triệu chứng không cải thiện sau 7 ngày, hãy liên hệ khuyến nông địa phương."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#FB8C00]" />
          <p className="text-[15px] font-[500] text-[#5C5C5C]">
            Đang chuẩn bị giao diện kết quả...
          </p>
        </div>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}
