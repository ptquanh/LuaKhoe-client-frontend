import {
  CameraOutlined,
  CheckCircleOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import { Button, Image as AntdImage, Modal, Upload as AntdUpload } from "antd";
import {
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Loader2,
  Maximize2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes";
import { diagnosisService } from "@/services/diagnosis.service";

import { AdvisorySectionView } from "./AdvisorySectionView";
import { DetectionResultsView } from "./DetectionResultsView";
import { parseDiagnoseResult } from "./diagnose.helper";
import { EmptyResultView } from "./EmptyResultView";
import { EnvAdjustmentView } from "./EnvAdjustmentView";
import { HealthyResultView } from "./HealthyResultView";

interface DiagnoseResultSectionProps {
  result: Record<string, any> | null;
  onResultUpdate?: (newResult: any) => void;
}

export function DiagnoseResultSection({
  result,
  onResultUpdate,
}: DiagnoseResultSectionProps) {
  const router = useRouter();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [reScoreTextIdx, setReScoreTextIdx] = useState(0);

  const reScoreTexts = [
    "AI đang phân tích kết cấu vết bệnh...",
    "Đang đối chiếu ảnh cận cảnh với thư viện tri thức RAG...",
    "Đang chạy thuật toán Bayes để tính toán xác suất liên đới...",
    "Đang tối ưu lại phác đồ điều trị và dinh dưỡng...",
    "Hoàn tất hiệu chỉnh! Chuẩn bị hiển thị kết quả...",
  ];

  // Re-scoring text message animation
  useEffect(() => {
    if (!isUploading) {
      return;
    }

    const interval = setInterval(() => {
      setReScoreTextIdx((prev) => (prev + 1) % reScoreTexts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isUploading, reScoreTexts.length]);

  const {
    hasResult,
    isHealthy,
    diseaseName,
    confidencePercent,
    severityStyle,
    resultsList,
    advisoryData,
    ragRecommendation,
    annotatedImage,
    envAdjustment,
    province,
    gpsLat,
    gpsLng,
    fieldParams,
  } = parseDiagnoseResult(result);

  const coreData = result || {};
  const diseaseList = coreData.results || coreData.detections || [];
  const isLowConfidence = coreData.low_confidence === true;
  const isMultiDisease = Array.isArray(diseaseList) && diseaseList.length > 1;
  const shouldShowSupplementBanner = isMultiDisease || isLowConfidence;
  const id = coreData.id;

  const imageList = [
    {
      title: "Ảnh phân tích AI",
      url: coreData.annotated_image || coreData.resultImageUrl,
    },
    {
      title: "Ảnh bổ sung",
      url: coreData.supplementAnnotatedImageUrl || coreData.supplementImageUrl,
    },
  ].filter((img) => img.url);

  const handleAntdUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!id) return;
    try {
      setIsUploading(true);
      setUploadError(null);
      setSuccessMsg(null);
      const res = await diagnosisService.uploadSupplementaryImage(
        id,
        file as File,
      );
      if (res.success && res.data) {
        if (onResultUpdate) {
          onResultUpdate((prev: any) => ({
            ...prev,
            ...res.data,
            weatherData: prev?.weatherData || res.data?.weatherData,
            fieldParams: prev?.fieldParams || (res.data as any)?.fieldParams,
            gpsLat:
              prev?.gpsLat !== null && prev?.gpsLat !== undefined
                ? prev.gpsLat
                : res.data?.gpsLat,
            gpsLng:
              prev?.gpsLng !== null && prev?.gpsLng !== undefined
                ? prev.gpsLng
                : res.data?.gpsLng,
          }));
        }
        setSuccessMsg("Tối ưu hóa chẩn đoán thành công!");
        onSuccess?.(res.data);
        setTimeout(() => {
          setIsUploadModalVisible(false);
          setSuccessMsg(null);
        }, 1500);
      } else {
        const errMsg = res.message || "Tải ảnh bổ sung thất bại.";
        setUploadError(errMsg);
        onError?.(new Error(errMsg));
      }
    } catch (err: any) {
      const errMsg = err.message || "Đã xảy ra lỗi khi tải ảnh lên.";
      setUploadError(errMsg);
      onError?.(new Error(errMsg));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-border bg-bg-card flex h-full flex-col rounded-2xl border shadow-xs">
      <div className="border-border border-b p-5">
        <h3 className="font-heading text-text-primary text-lg font-semibold">
          Kết quả chẩn đoán
        </h3>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {!hasResult ? (
          <EmptyResultView />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {shouldShowSupplementBanner && (
              <div className="animate-in fade-in slide-in-from-top-2 border-warning/35 bg-accent-light/50 mb-6 w-full overflow-hidden rounded-2xl border p-4 shadow-xs duration-300 sm:p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent-light text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <ScanOutlined className="animate-pulse text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-text-primary m-0 text-base font-semibold">
                        Cần thêm dữ liệu để chốt chẩn đoán
                      </h3>
                      <p className="text-text-secondary mt-1 mb-0 text-sm leading-relaxed">
                        {isMultiDisease
                          ? "AI phát hiện nhiều dấu hiệu bệnh đan xen trên lá. Hãy cung cấp 1 ảnh chụp thật gần để xác minh kết quả chính xác nhất."
                          : "Ảnh chụp chưa đủ độ chi tiết. Vui lòng tải thêm 1 ảnh cận cảnh vết bệnh để AI phân tích lại."}
                      </p>
                    </div>
                  </div>

                  <div className="ml-0 sm:ml-13">
                    <Button
                      type="primary"
                      size="large"
                      icon={<CameraOutlined />}
                      onClick={() => setIsUploadModalVisible(true)}
                      className="min-h-11 shadow-xs"
                      shape="round"
                    >
                      Tải ảnh cận cảnh
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Horizontal Scroll of Diagnostic Images */}
            {imageList.length > 0 && (
              <div className="animate-in fade-in mb-6 duration-300">
                <h3 className="font-heading text-text-primary mb-3 text-base font-semibold sm:text-lg">
                  Hình ảnh chẩn đoán
                </h3>
                <AntdImage.PreviewGroup>
                  <div className="custom-image-slider flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                    {imageList.map((img, index) => (
                      <div
                        key={index}
                        className="flex flex-none snap-center flex-col items-center"
                      >
                        <div className="border-border bg-bg-subtle relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border shadow-xs sm:h-56 sm:w-56">
                          <AntdImage
                            src={img.url}
                            alt={img.title}
                            className="object-cover"
                            style={{ width: "100%", height: "100%" }}
                            preview={{ mask: "Thu phóng" }}
                          />
                        </div>
                        <span className="border-primary-border bg-primary-light text-primary mt-2 rounded-full border px-3 py-1 text-xs font-semibold">
                          {img.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </AntdImage.PreviewGroup>
              </div>
            )}

            {/* Environmental Adjustment Module */}
            {envAdjustment && envAdjustment.applied && (
              <EnvAdjustmentView adjustment={envAdjustment} />
            )}

            {/* Metadata (Location & Field Params) */}
            {(province || fieldParams) && (
              <div className="border-border bg-bg-subtle/70 mb-6 rounded-xl border p-4">
                <div className="border-border text-text-primary mb-3 flex items-center gap-2 border-b pb-2 text-sm font-semibold">
                  <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full text-white">
                    <Maximize2 className="h-3 w-3" />
                  </div>
                  Thông tin thực địa
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {province && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-text-secondary text-[11px] font-medium tracking-wider uppercase">
                        Vùng miền
                      </span>
                      <span className="text-text-primary text-sm font-semibold">
                        {province}
                      </span>
                      {gpsLat && gpsLng && (
                        <span className="text-text-secondary text-[11px] tabular-nums">
                          ({gpsLat.toFixed(4)}, {gpsLng.toFixed(4)})
                        </span>
                      )}
                    </div>
                  )}
                  {fieldParams && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-text-secondary text-[11px] font-medium tracking-wider uppercase">
                        Tình trạng ruộng
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <span className="border-border bg-bg-card text-text-primary rounded-md border px-2 py-0.5 text-xs font-medium">
                          {fieldParams.growth}
                        </span>
                        <span className="border-border bg-bg-card text-text-primary rounded-md border px-2 py-0.5 text-xs font-medium">
                          Nước: {fieldParams.water}
                        </span>
                        {fieldParams.leafhopper && (
                          <span className="bg-accent-light text-accent rounded-md px-2 py-0.5 text-xs font-semibold">
                            Có rầy nâu
                          </span>
                        )}
                        {fieldParams.fog && (
                          <span className="bg-info/15 text-info rounded-md px-2 py-0.5 text-xs font-semibold">
                            Sương mù
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isHealthy ? (
              <HealthyResultView
                diseaseName={diseaseName}
                confidencePercent={confidencePercent}
              />
            ) : (
              <DetectionResultsView
                resultsList={resultsList}
                diseaseName={diseaseName}
                confidencePercent={confidencePercent}
                severityStyle={severityStyle}
                envAdjustment={envAdjustment}
              />
            )}

            {!isHealthy && (
              <>
                <AdvisorySectionView
                  advisoryData={advisoryData}
                  ragRecommendation={ragRecommendation}
                />

                {id && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.push(`${ROUTES.RESULT}?id=${id}`)}
                      className="border-primary text-primary hover:bg-primary-light flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors sm:w-auto"
                    >
                      Xem chi tiết phác đồ <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="bg-bg-card relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <h4 className="font-heading text-text-primary text-base font-semibold">
                Ảnh phân tích chi tiết
              </h4>
              <button
                type="button"
                aria-label="Đóng xem ảnh"
                className="text-text-secondary hover:bg-bg-hover flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
                onClick={() => setZoomedImage(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex max-h-[calc(90vh-100px)] items-center justify-center overflow-auto p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedImage}
                alt="Zoomed Annotated"
                className="max-h-[75vh] w-auto rounded-lg object-contain shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
      {/* Ant Design Supplementary Image Upload Modal */}
      <Modal
        open={isUploadModalVisible}
        onCancel={() => {
          if (!isUploading) {
            setIsUploadModalVisible(false);
            setUploadError(null);
            setSuccessMsg(null);
          }
        }}
        title={
          <span className="font-heading text-text-primary text-lg font-bold">
            Tải ảnh cận cảnh (Macro)
          </span>
        }
        footer={null}
        centered
        width={500}
      >
        <div className="space-y-4 py-4">
          <div className="animate-in fade-in border-primary-border bg-primary-light/60 text-text-primary mb-5 rounded-xl border p-3.5 text-sm duration-300">
            <p className="text-primary mb-2 flex items-center gap-1.5 font-semibold">
              <Lightbulb className="h-4 w-4 shrink-0" />
              Mẹo chụp ảnh để AI nhận diện tốt nhất:
            </p>
            <ul className="text-text-secondary mb-0 flex list-none flex-col gap-1.5 pl-0">
              <li className="flex items-center">
                <CheckCircleOutlined className="text-primary mr-2 shrink-0" />
                Đưa camera sát vết bệnh (cách 10-15cm).
              </li>
              <li className="flex items-center">
                <CheckCircleOutlined className="text-primary mr-2 shrink-0" />
                Chạm vào màn hình để lấy nét rõ vết xước/đốm.
              </li>
              <li className="flex items-center">
                <CheckCircleOutlined className="text-primary mr-2 shrink-0" />
                Đảm bảo đủ ánh sáng, không bị bóng râm che khuất.
              </li>
            </ul>
          </div>

          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-8">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <p className="text-primary animate-pulse text-sm font-semibold">
                {reScoreTexts[reScoreTextIdx]}
              </p>
            </div>
          ) : (
            <AntdUpload.Dragger
              name="image"
              multiple={false}
              showUploadList={false}
              customRequest={handleAntdUpload}
              accept="image/*"
              className="bg-bg-subtle rounded-xl transition-colors"
            >
              <p className="ant-upload-drag-icon flex justify-center p-4">
                <CameraOutlined
                  className="text-primary opacity-85"
                  style={{ fontSize: "36px" }}
                />
              </p>
              <p className="ant-upload-text text-text-primary font-medium">
                Nhấp hoặc kéo thả ảnh vào đây
              </p>
              <p className="ant-upload-hint text-text-secondary">
                Hỗ trợ định dạng JPG, PNG
              </p>
            </AntdUpload.Dragger>
          )}

          {uploadError && (
            <div className="animate-in fade-in border-error/30 bg-error/10 text-error mt-4 flex items-start gap-2 rounded-xl border p-3 text-xs font-medium">
              <X className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {successMsg && (
            <div className="border-primary-border bg-primary-light text-primary mt-4 flex animate-pulse items-start gap-2 rounded-xl border p-3 text-xs font-medium">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
