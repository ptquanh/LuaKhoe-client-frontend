"use client";

import { message } from "antd";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { FIELD_PARAM_DEFAULTS } from "@/constants/diagnose";
import { useDiagnose } from "@/hooks/useDiagnose";
import { useProfile } from "@/hooks/useProfile";
import { FieldParams } from "@/types/diagnose.type";

import { DiagnoseGuidelines } from "./components/DiagnoseGuidelines";
import { DiagnoseResultSection } from "./components/DiagnoseResultSection";
import { DiagnoseUploadSection } from "./components/DiagnoseUploadSection";

const suggestedTags = [
  "Lá vàng",
  "Có đốm",
  "Thân héo",
  "Mới gieo sạ",
  "Lá khô",
  "Cháy lá",
  "Rễ thối",
  "Bông bị cháy",
];

export default function DiagnosePage() {
  const router = useRouter();
  const { predict, isLoading, result, error, reset } = useDiagnose();
  const { profile } = useProfile();

  const [file, setFile] = useState<{ raw: File; url: string } | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Environment and Field condition parameters
  const [gpsLat, setGpsLat] = useState<number | undefined>(undefined);
  const [gpsLng, setGpsLng] = useState<number | undefined>(undefined);
  const [fieldId, setFieldId] = useState<string | undefined>(undefined);

  const [fieldParams, setFieldParams] =
    useState<FieldParams>(FIELD_PARAM_DEFAULTS);

  // Load default location if available
  useEffect(() => {
    if (
      profile?.profile?.defaultGpsLat !== undefined &&
      profile?.profile?.defaultGpsLat !== null &&
      profile?.profile?.defaultGpsLng !== undefined &&
      profile?.profile?.defaultGpsLng !== null
    ) {
      setGpsLat(Number(profile.profile.defaultGpsLat));
      setGpsLng(Number(profile.profile.defaultGpsLng));
    }
  }, [profile]);

  // Redirect to onboarding if default location is missing and not skipped
  useEffect(() => {
    if (profile) {
      const hasDefaultLoc =
        profile.profile?.defaultGpsLat !== null &&
        profile.profile?.defaultGpsLat !== undefined &&
        profile.profile?.defaultGpsLng !== null &&
        profile.profile?.defaultGpsLng !== undefined;
      const onboardingSkipped =
        typeof window !== "undefined" &&
        localStorage.getItem("onboarding_skipped") === "true";

      if (!hasDefaultLoc && !onboardingSkipped) {
        router.push("/onboarding/location");
      }
    }
  }, [profile, router]);

  const handleFileSelect = (f: File) => {
    setFile({ raw: f, url: URL.createObjectURL(f) });
    reset();
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  const handlePredict = () => {
    if (file) {
      if (!fieldId && (gpsLat === undefined || gpsLng === undefined)) {
        message.warning(
          "Chưa lấy được tọa độ. Đang sử dụng dữ liệu thời tiết mặc định.",
          5,
        );
      }
      predict({
        image: file.raw,
        envDescription: description || undefined,
        gpsLat,
        gpsLng,
        fieldParams: fieldParams,
        fieldId,
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] pb-20">
      <div className="mb-6">
        <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
          Chẩn đoán bệnh lúa
        </h1>
        <p className="mt-1 text-[14px] text-[#5C5C5C]">
          Tải lên ảnh lá lúa để AI phân tích và chẩn đoán bệnh
        </p>
      </div>

      {!file && (
        <DiagnoseGuidelines
          showExamples={showExamples}
          setShowExamples={setShowExamples}
        />
      )}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#FB8C00] bg-[#FFF8E1] p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#FB8C00]" />
          <p className="text-[14px] font-[500] text-[#F57C00]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        <div className="h-fit max-h-[calc(100vh-3rem)] overflow-y-auto pr-1 md:sticky md:top-6">
          <DiagnoseUploadSection
            file={file}
            onFileSelect={handleFileSelect}
            result={result}
            isLoading={isLoading}
            description={description}
            setDescription={setDescription}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            suggestedTags={suggestedTags}
            fieldParams={fieldParams}
            setFieldParams={setFieldParams}
            gpsLat={gpsLat}
            setGpsLat={setGpsLat}
            gpsLng={gpsLng}
            setGpsLng={setGpsLng}
            fieldId={fieldId}
            setFieldId={setFieldId}
            handleReset={handleReset}
            handlePredict={handlePredict}
          />
        </div>

        <div>
          <DiagnoseResultSection result={result} />
        </div>
      </div>
    </div>
  );
}
