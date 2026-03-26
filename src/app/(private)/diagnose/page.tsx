"use client";

import { Alert, Button, Card, Progress, Tag, Typography, Upload } from "antd";
import { RcFile } from "antd/es/upload/interface";
import { useState } from "react";

import { useDiagnose } from "@/hooks/useDiagnose";

import DiagnoseExamples from "./_components/DiagnoseExamples";
import {
  BigUploadIcon,
  CameraIcon,
  FocusIcon,
  InfoCircleIcon,
  LeafIcon,
  RainSlashIcon,
  SunIcon,
  UploadIcon,
} from "./_components/Icons";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

export default function DiagnosePage() {
  const { predict, isLoading, result, error, reset } = useDiagnose();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(true);

  const handleUpload = (file: RcFile) => {
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    reset(); // Clear previous errors or results when a new file is selected

    // Auto clear examples and trigger predict to mimic real UX workflow
    setShowExamples(false);
    return false; // Prevent automatic upload
  };

  const handlePredict = async () => {
    if (!file) return;
    await predict(file);
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    reset();
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical":
        return { color: "red", label: "Cấp bách" };
      case "high":
        return { color: "orange", label: "Nghiêm trọng" };
      case "medium":
        return { color: "gold", label: "Trung bình" };
      case "low":
        return { color: "green", label: "Nhẹ" };
      default:
        return { color: "blue", label: "Bình thường" };
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-5xl px-4 pt-10">
        <div className="mb-6">
          <Title level={2} className="!mb-1 text-gray-800">
            Chẩn đoán bệnh lúa
          </Title>
          <Text className="text-gray-500">
            Tải lên ảnh lá lúa để AI phân tích và chẩn đoán bệnh
          </Text>
        </div>

        {/* Bảng Hướng Dẫn */}
        <div className="mb-4 rounded-xl border border-green-100 bg-green-50/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-green-700">
              <InfoCircleIcon />
              <span>Hướng dẫn chụp ảnh lá lúa rõ nét</span>
            </div>
            <button
              className="text-sm font-medium text-green-700 underline hover:text-green-800"
              onClick={() => setShowExamples(!showExamples)}
            >
              {showExamples ? "Ẩn ảnh mẫu" : "Hiện ảnh mẫu"}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <SunIcon />
              <span>Chụp ngoài trời, đủ ánh sáng tự nhiên</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <FocusIcon />
              <span>Chụp gần, rõ vết bệnh trên lá (15-30cm)</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <RainSlashIcon />
              <span>Tránh chụp khi lá ướt sương hoặc mưa</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <LeafIcon />
              <span>Đặt lá trên nền phẳng nếu có thể</span>
            </div>
          </div>
        </div>

        {/* Bảng Ảnh Mẫu */}
        {showExamples && <DiagnoseExamples />}

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-6 rounded-lg font-medium"
          />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Cột Upload & Preview */}
          <div className="flex flex-col gap-4">
            {!previewUrl ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-[2px]">
                <Dragger
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleUpload}
                  className="rounded-[14px] border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center hover:border-green-500 hover:bg-green-50/20"
                  height={320}
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <BigUploadIcon />
                  </div>
                  <Title level={4} className="!mb-1 text-gray-800">
                    Kéo thả hoặc chọn file
                  </Title>
                  <Text className="mb-6 block text-gray-400">
                    Hỗ trợ JPG, PNG, WEBP. Tối đa 10MB
                  </Text>

                  {/* Buttons */}
                  <div
                    className="flex flex-wrap items-center justify-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Upload
                      showUploadList={false}
                      beforeUpload={handleUpload}
                      accept="image/*"
                    >
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#166534",
                          borderColor: "#166534",
                        }}
                        className="flex h-10 items-center justify-center rounded-lg px-6 font-medium"
                      >
                        Chọn ảnh
                      </Button>
                    </Upload>
                    <Upload
                      showUploadList={false}
                      beforeUpload={handleUpload}
                      accept="image/*"
                      capture="environment"
                    >
                      <Button className="flex h-10 items-center justify-center rounded-lg px-6 font-medium text-gray-600">
                        Chụp ảnh
                      </Button>
                    </Upload>
                  </div>
                </Dragger>
              </div>
            ) : (
              <Card className="rounded-2xl border border-gray-200 shadow-sm">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    size="large"
                    className="flex-1 rounded-lg border-gray-300 font-medium text-gray-600 hover:border-green-500 hover:text-green-700"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    Chụp lại ảnh
                  </Button>
                  {!result && (
                    <Button
                      type="primary"
                      size="large"
                      className="flex-1 rounded-lg border-green-700 bg-green-700 font-medium hover:bg-green-800"
                      onClick={handlePredict}
                      loading={isLoading}
                    >
                      Phân tích AI
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Cột Kết quả AI */}
          <div>
            <Card className="h-full rounded-2xl border-gray-200 shadow-sm">
              <Title level={4} className="!mb-6 text-gray-800">
                Kết quả phân tích
              </Title>

              {!result ? (
                <div className="flex h-[280px] flex-col items-center justify-center text-center text-gray-400">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-green-600"></div>
                      <p className="font-medium text-gray-500">
                        AI đang xử lý hình ảnh...
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="max-w-[200px]">
                        Kết quả sẽ hiển thị tại đây sau khi bạn tải ảnh lên
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="mb-6 rounded-xl border border-green-200/60 bg-green-50 p-4 shadow-sm shadow-green-100/20">
                    <div className="mb-2 flex items-center justify-between">
                      <Text className="text-sm font-semibold tracking-wide text-green-800/60 uppercase">
                        Bệnh được phát hiện
                      </Text>
                      <Tag
                        color={getSeverityStyle(result.severity).color}
                        className="m-0 border-transparent px-2 py-0.5 font-medium"
                      >
                        Mức độ: {getSeverityStyle(result.severity).label}
                      </Tag>
                    </div>
                    <Title level={3} className="!mb-2 !text-green-800">
                      {result.disease_name}
                    </Title>
                    <div className="flex items-center gap-3 rounded-lg bg-white/60 p-2 text-sm text-gray-600">
                      <span className="font-medium">Độ chính xác:</span>
                      <Progress
                        percent={Math.round(result.confidence * 100)}
                        size="small"
                        status="active"
                        strokeColor="#166534"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <Title level={5} className="!text-gray-800">
                      Về loại bệnh này
                    </Title>
                    <Paragraph className="rounded-lg border border-gray-100 bg-gray-50 p-3 leading-relaxed text-gray-600">
                      {result.description}
                    </Paragraph>
                  </div>

                  <div>
                    <Title level={5} className="!text-gray-800">
                      Phác đồ chăm sóc & điều trị
                    </Title>
                    <ul className="mt-3 space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2 rounded-lg border border-blue-50/50 bg-blue-50/30 p-2 text-gray-600"
                        >
                          <span className="mt-0.5 font-bold text-green-600">
                            •
                          </span>
                          <span className="leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-5">
                    <Button
                      type="dashed"
                      block
                      size="large"
                      className="border-green-200 bg-green-50/50 font-medium text-green-700 hover:border-green-400 hover:text-green-800"
                    >
                      Kết nối chuyên gia (Sắp ra mắt)
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
