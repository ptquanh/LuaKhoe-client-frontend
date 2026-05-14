"use client";

import { Info } from "lucide-react";
import { useState } from "react";

import { useDiagnose } from "@/hooks/useDiagnose";

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
  const { predict, isLoading, result, error, reset } = useDiagnose();

  const [file, setFile] = useState<{ raw: File; url: string } | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      predict({
        image: file.raw,
        envDescription: description || undefined,
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          handleReset={handleReset}
          handlePredict={handlePredict}
        />

        <DiagnoseResultSection result={result} />
      </div>
    </div>
  );
}
