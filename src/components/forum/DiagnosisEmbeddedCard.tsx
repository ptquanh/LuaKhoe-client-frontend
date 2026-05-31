"use client";

import { DiagnosisResponse } from "@/types/diagnose.type";
import { LockOutlined } from "@ant-design/icons";
import { Image, Modal } from "antd";
import { getCookie } from "cookies-next";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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
          <span className="text-xl font-bold text-gray-800">
            Nội dung dành cho Thành viên
          </span>
        ),
        icon: <LockOutlined className="text-green-600" />,
        content: (
          <div className="mt-2 text-gray-600">
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
          style: {
            backgroundColor: "#16a34a",
            borderColor: "#16a34a",
            color: "white",
          },
          className: "hover:!opacity-90 border-none",
        },
        cancelButtonProps: {
          shape: "round",
          className:
            "hover:!text-green-600 hover:!border-green-600 hover:!bg-green-50",
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
    <div className="mt-4 flex gap-4 rounded-xl border border-emerald-100 bg-[#F8FAFC] p-3.5 transition-all hover:border-emerald-300 hover:shadow-xs dark:border-emerald-950/30 dark:bg-emerald-950/5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white dark:border-gray-800">
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
          <div className="flex items-center gap-1 text-[12px] font-semibold text-[#5C5C5C] dark:text-gray-400">
            <Sparkles className="h-3.5 w-3.5 text-[#2F9E44]" />
            <span>Đã chẩn đoán bằng AI</span>
          </div>

          <p className="mt-1 text-[15px] font-[700] text-[#1F6F2E] dark:text-emerald-400">
            {diseaseName}{" "}
            {primaryResult && (
              <span className="ml-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-extrabold text-[#2F9E44] dark:bg-emerald-950/50 dark:text-emerald-400">
                {confidencePercent}%
              </span>
            )}
          </p>
        </div>

        <div className="mt-2 flex items-center">
          <button
            onClick={handleViewDetail}
            className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[13px] font-bold text-[#2F9E44] transition-colors hover:text-[#1F6F2E] dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <span>Xem chi tiết RAG & điều trị</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
