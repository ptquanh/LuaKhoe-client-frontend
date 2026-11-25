"use client";

import { useEffect, useState } from "react";

import { diagnosisService } from "@/services/diagnosis.service";
import { DiseaseItem, diseaseService } from "@/services/disease.service";
import { feedbackService } from "@/services/feedback.service";
import { DiagnosisResponse } from "@/types/diagnose.type";
import { FeedbackItem } from "@/types/feedback.type";

export function useDiagnosisResult(id: string | null) {
  const [loading, setLoading] = useState<boolean>(() => Boolean(id));
  const [error, setError] = useState<string | null>(() =>
    !id ? "Không tìm thấy ID chẩn đoán." : null,
  );
  const [data, setData] = useState<DiagnosisResponse | null>(null);
  const [existingFeedback, setExistingFeedback] = useState<FeedbackItem | null>(
    null,
  );
  const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
  const [checkedActions, setCheckedActions] = useState<boolean[]>([]);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchDiagnosisAndFeedback = async () => {
      try {
        const [res, fbRes, diseasesRes] = await Promise.all([
          diagnosisService.getById(id),
          feedbackService.getMyFeedbacks().catch(() => null),
          diseaseService.getDiseases().catch(() => null),
        ]);

        if (cancelled) return;

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

        if (diseasesRes?.success && diseasesRes.data) {
          setDiseases(diseasesRes.data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : "Đã xảy ra lỗi khi tải dữ liệu.";
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDiagnosisAndFeedback();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const toggleCheck = (index: number) => {
    setCheckedActions((prev) =>
      prev.map((val, i) => (i === index ? !val : val)),
    );
  };

  const handleFeedbackSubmit = async (
    rating: number,
    comment: string,
    actualDiseaseIds?: string[],
  ) => {
    if (!id) return;
    try {
      const content = comment.trim() || undefined;
      const finalActualDiseaseIds = actualDiseaseIds || [];

      const res = await feedbackService.submit({
        diagnosisId: id,
        rating,
        content,
        actualDiseaseIds: finalActualDiseaseIds,
      });

      const submittedActualDiseases = finalActualDiseaseIds.map((diseaseId) => {
        const foundDisease = diseases.find((d) => d.id === diseaseId);
        return {
          id: Math.random().toString(),
          feedbackId: res.data?.id || "temp",
          diseaseId,
          disease: {
            id: diseaseId,
            name: foundDisease?.name || "Bệnh đã chọn",
          },
        };
      });

      setExistingFeedback({
        id: res.data?.id || Date.now().toString(),
        diagnosisId: id,
        userId: "current",
        rating,
        content,
        actualDiseases: submittedActualDiseases,
        status: content ? "PENDING" : "APPROVED",
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Lỗi gửi phản hồi:", err);
    }
  };

  return {
    loading,
    error,
    data,
    existingFeedback,
    diseases,
    checkedActions,
    toggleCheck,
    handleFeedbackSubmit,
  };
}
