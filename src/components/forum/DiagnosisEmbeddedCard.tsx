"use client";

import { LockOutlined } from "@ant-design/icons";
import { Image, Modal } from "antd";
import { getCookie } from "cookies-next";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { DiagnosisResponse } from "@/types/diagnose.type";

interface DiagnosisEmbeddedCardProps {
  diagnosis: DiagnosisResponse;
}

export default function DiagnosisEmbeddedCard({
  diagnosis,
}: DiagnosisEmbeddedCardProps) {
  const router = useRouter();

  // Sort results by confidence descending to get the primary disease
  const results = diagnosis.results || [];
  const primaryResult =
    results.length > 0
      ? [...results].sort((a, b) => b.confidence - a.confidence)[0]
      : null;

  const diseaseName =
    primaryResult?.disease?.name || "Không phát hiện bệnh hại";
  const confidenceVal = primaryResult ? Number(primaryResult.confidence) : 0;
  const confidencePercent =
    confidenceVal <= 1
      ? Math.round(confidenceVal * 100)
      : Math.round(confidenceVal);

  const imageUrl =
    diagnosis.resultImageUrl ||
    diagnosis.originalImageUrl ||
    "/images/rice-default.png";

  const handleViewDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = getCookie("access_token");
    if (!token) {
      Modal.confirm({
        title: (
          <span className="text-xl font-bold text-[var(--text-primary)]">
            Nội dung dành cho Thành viên
          </span>
        ),
        icon: <LockOutlined className="text-[var(--primary)]" />,
        content: (
          <div className="mt-2 text-[var(--text-secondary)]">
            Bạn cần đăng nhập tài khoản để xem chi tiết phác đồ điều trị và gợi
            ý phân bón NPK cho chẩn đoán này.
          </div>
        ),
        okText: "Đăng nhập ngay",
        cancelText: "Để sau",
        centered: true,
        maskClosable: true,
        okButtonProps: {
          shape: "round",
          type: "primary",
        },
        cancelButtonProps: {
          shape: "round",
        },
        onOk: () => {
          const redirectPath = encodeURIComponent(
            window.location.pathname + window.location.search,
          );
          router.push(`/login?redirect=${redirectPath}`);
        },
      });
    } else {
      router.push(`/result?id=${diagnosis.id}`);
    }
  };

  return (
    <div className="mt-4 flex gap-4 rounded-xl border border-[var(--primary-border)] bg-[var(--bg-subtle)] p-3.5 transition-colors hover:border-[var(--primary)]">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
        <Image
          src={imageUrl}
          alt={diseaseName}
          preview={false}
          className="object-cover"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>Đã chẩn đoán bằng AI</span>
          </div>

          <p className="mt-1 text-[15px] font-bold text-[var(--text-primary)]">
            {diseaseName}{" "}
            {primaryResult && (
              <span className="ml-1 inline-flex items-center rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--primary)] tabular-nums">
                {confidencePercent}%
              </span>
            )}
          </p>
        </div>

        <div className="mt-2 flex items-center">
          <button
            onClick={handleViewDetail}
            className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[13px] font-bold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
          >
            <span>Xem chi tiết RAG & điều trị</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
