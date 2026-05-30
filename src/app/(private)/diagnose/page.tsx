"use client";

import { message } from "antd";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FIELD_PARAM_DEFAULTS } from "@/constants/diagnose";
import { useAuth } from "@/hooks/useAuth";
import { useDiagnose } from "@/hooks/useDiagnose";
import { useProfile } from "@/hooks/useProfile";
import { useUserFields } from "@/hooks/useUserFields";
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
  const { predict, isLoading, result, error, reset, setResult } = useDiagnose();
  const { profile } = useProfile();
  const { user } = useAuth();
  const { fields, isLoading: isFieldsLoading } = useUserFields();

  const [file, setFile] = useState<{ raw: File; url: string } | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [description, setDescription] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Environment and Field condition parameters
  const [gpsLat, setGpsLat] = useState<number | undefined>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("temp_gps_lat");
      return saved ? Number(saved) : undefined;
    }
    return undefined;
  });
  const [gpsLng, setGpsLng] = useState<number | undefined>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("temp_gps_lng");
      return saved ? Number(saved) : undefined;
    }
    return undefined;
  });
  const [fieldId, setFieldId] = useState<string | undefined>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("temp_field_id");
      return saved ? saved : undefined;
    }
    return undefined;
  });
  const [modelVersionId, setModelVersionId] = useState<string | undefined>(
    undefined,
  );

  const [fieldParams, setFieldParams] =
    useState<FieldParams>(FIELD_PARAM_DEFAULTS);

  // Sync state to sessionStorage for session persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (gpsLat !== undefined) {
        sessionStorage.setItem("temp_gps_lat", gpsLat.toString());
      } else {
        sessionStorage.removeItem("temp_gps_lat");
      }
    }
  }, [gpsLat]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (gpsLng !== undefined) {
        sessionStorage.setItem("temp_gps_lng", gpsLng.toString());
      } else {
        sessionStorage.removeItem("temp_gps_lng");
      }
    }
  }, [gpsLng]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (fieldId !== undefined) {
        sessionStorage.setItem("temp_field_id", fieldId);
      } else {
        sessionStorage.removeItem("temp_field_id");
      }
    }
  }, [fieldId]);

  // Load default location if available (only if no sessionStorage exists)
  useEffect(() => {
    const hasTempGps =
      typeof window !== "undefined" &&
      sessionStorage.getItem("temp_gps_lat") !== null;
    if (hasTempGps) return;

    if (profile?.role === "FARMER" && fields.length > 0) {
      const defaultField = fields.find((f) => f.isDefault);
      if (defaultField) {
        setGpsLat(Number(defaultField.gpsLat));
        setGpsLng(Number(defaultField.gpsLng));
      }
    }
  }, [profile, fields]);

  // Redirect to onboarding if default location is missing and not skipped (only for FARMERs)
  useEffect(() => {
    if (user && profile && user.role !== "ADMIN" && !isFieldsLoading) {
      const hasDefaultLoc = fields.some((f) => f.isDefault);
      const onboardingSkipped =
        typeof window !== "undefined" &&
        localStorage.getItem(`onboarding_skipped_${user.id}`) === "true";

      if (!onboardingSkipped) {
        if (!user.hasPassword) {
          router.push("/onboarding/password");
        } else if (!hasDefaultLoc) {
          router.push("/onboarding/location");
        }
      }
    }
  }, [user, profile, fields, isFieldsLoading, router]);

  const handleFileSelect = (f: File) => {
    setFile({ raw: f, url: URL.createObjectURL(f) });
    reset();
  };

  const handleReset = () => {
    setFile(null);
    setDescription("");
    setFieldDescription("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("temp_gps_lat");
      sessionStorage.removeItem("temp_gps_lng");
      sessionStorage.removeItem("temp_field_id");
    }
    setGpsLat(undefined);
    setGpsLng(undefined);
    setFieldId(undefined);
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
      // Kiểm tra xem người dùng đã chủ động chọn bất kỳ thông số nào chưa
      const hasParams =
        fieldParams.water ||
        fieldParams.growth ||
        fieldParams.density ||
        fieldParams.fog !== null ||
        fieldParams.pesticide !== null;

      predict({
        image: file.raw,
        envDescription: description || undefined,
        fieldDescription: fieldDescription || undefined,
        gpsLat,
        gpsLng,
        fieldParams: hasParams ? fieldParams : undefined,
        fieldId,
        modelVersionId,
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
            fieldDescription={fieldDescription}
            setFieldDescription={setFieldDescription}
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
            modelVersionId={modelVersionId}
            setModelVersionId={setModelVersionId}
            handleReset={handleReset}
            handlePredict={handlePredict}
          />
        </div>

        <div>
          <DiagnoseResultSection result={result} onResultUpdate={setResult} />
        </div>
      </div>
    </div>
  );
}
