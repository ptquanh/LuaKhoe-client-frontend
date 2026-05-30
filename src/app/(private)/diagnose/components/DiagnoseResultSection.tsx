import { diagnosisService } from "@/services/diagnosis.service";
import {
  CameraOutlined,
  CheckCircleOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import { Image as AntdImage, Upload as AntdUpload, Button, Modal } from "antd";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  Maximize2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

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
      setReScoreTextIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setReScoreTextIdx((prev) => (prev + 1) % reScoreTexts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isUploading]);

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
    <div className="flex h-full flex-col rounded-xl border border-[#E0E0E0] bg-white">
      <div className="border-b border-[#E0E0E0] p-5">
        <h3 className="text-[18px] font-[600] text-[#1B1B1B]">
          Kết quả chẩn đoán
        </h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {!hasResult ? (
          <EmptyResultView />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {shouldShowSupplementBanner && (
              <div className="animate-in fade-in slide-in-from-top-2 mb-6 w-full overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50/50 p-4 shadow-sm duration-300 sm:p-5">
                {/* Đổi từ row sang col hoàn toàn */}
                <div className="flex flex-col gap-4">
                  {/* Phần Icon và Chữ (Full width) */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <ScanOutlined className="animate-pulse text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="m-0 text-base font-semibold text-gray-800">
                        Cần thêm dữ liệu để chốt chẩn đoán
                      </h3>
                      <p className="mt-1 mb-0 text-sm leading-relaxed text-gray-600">
                        {isMultiDisease
                          ? "AI phát hiện nhiều dấu hiệu bệnh đan xen trên lá. Hãy cung cấp 1 ảnh chụp thật gần để xác minh kết quả chính xác nhất."
                          : "Ảnh chụp chưa đủ độ chi tiết. Vui lòng tải thêm 1 ảnh cận cảnh vết bệnh để AI phân tích lại."}
                      </p>
                    </div>
                  </div>

                  {/* Phần Nút bấm (Nằm dưới, căn thụt lề cho thẳng hàng với chữ) */}
                  <div className="ml-0 sm:ml-13">
                    <Button
                      type="primary"
                      size="large"
                      icon={<CameraOutlined />}
                      onClick={() => setIsUploadModalVisible(true)}
                      className="border-none bg-[#16a34a] shadow-md hover:bg-[#15803d]"
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
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Hình ảnh chẩn đoán
                </h3>
                <AntdImage.PreviewGroup>
                  <div className="custom-image-slider flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                    {imageList.map((img, index) => (
                      <div
                        key={index}
                        className="flex flex-none snap-center flex-col items-center"
                      >
                        <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm sm:h-56 sm:w-56">
                          <AntdImage
                            src={img.url}
                            alt={img.title}
                            className="object-cover"
                            style={{ width: "100%", height: "100%" }}
                            preview={{ mask: "Thu phóng" }}
                          />
                        </div>
                        <span className="mt-2 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-sm font-medium text-gray-600">
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
              <div className="mb-6 rounded-xl border border-[#E0E0E0] bg-[#F8F9FA] p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 border-b border-[#E0E0E0] pb-2 text-[14px] font-[600] text-[#1B1B1B]">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F9E44] text-white">
                    <Maximize2 className="h-3 w-3" />
                  </div>
                  Thông tin thực địa
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {province && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-[500] tracking-wider text-[#5C5C5C] uppercase">
                        Vùng miền
                      </span>
                      <span className="text-[13px] font-[600] text-[#1B1B1B]">
                        {province}
                      </span>
                      {gpsLat && gpsLng && (
                        <span className="text-[10px] text-[#5C5C5C]">
                          ({gpsLat.toFixed(4)}, {gpsLng.toFixed(4)})
                        </span>
                      )}
                    </div>
                  )}
                  {fieldParams && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-[500] tracking-wider text-[#5C5C5C] uppercase">
                        Tình trạng ruộng
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <span className="rounded-md border border-[#E0E0E0] bg-white px-2 py-0.5 text-[11px] font-[500] text-[#1B1B1B]">
                          {fieldParams.growth}
                        </span>
                        <span className="rounded-md border border-[#E0E0E0] bg-white px-2 py-0.5 text-[11px] font-[500] text-[#1B1B1B]">
                          Nước: {fieldParams.water}
                        </span>
                        {fieldParams.leafhopper && (
                          <span className="rounded-md border border-[#FFE0B2] bg-[#FFF3E0] px-2 py-0.5 text-[11px] font-[600] text-[#E65100]">
                            Có rầy nâu
                          </span>
                        )}
                        {fieldParams.fog && (
                          <span className="rounded-md border border-[#BBDEFB] bg-[#E3F2FD] px-2 py-0.5 text-[11px] font-[600] text-[#1565C0]">
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

                <div className="mt-6 flex justify-end">
                  <button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#2F9E44] px-4 text-[14px] font-[500] text-[#2F9E44] transition-colors hover:bg-[#E6F4EA]">
                    Xem chi tiết phác đồ <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
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
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E0E0E0] px-4 py-3">
              <h4 className="text-[16px] font-[600] text-[#1B1B1B]">
                Ảnh phân tích chi tiết
              </h4>
              <button
                className="rounded-full p-1.5 text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5]"
                onClick={() => setZoomedImage(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex max-h-[calc(90vh-100px)] items-center justify-center overflow-auto p-4">
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
          <span className="text-lg font-bold text-gray-800">
            Tải ảnh cận cảnh (Macro)
          </span>
        }
        footer={null}
        centered
        width={500}
      >
        <div className="space-y-4 py-4">
          {/* Hướng dẫn chụp ảnh */}
          <div className="animate-in fade-in mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 duration-300">
            <p className="mb-2 flex items-center gap-1.5 font-semibold">
              💡 Mẹo chụp ảnh để AI nhận diện tốt nhất:
            </p>
            <ul className="mb-0 flex list-none flex-col gap-1.5 pl-0">
              <li className="flex items-center text-green-900">
                <CheckCircleOutlined className="mr-2 shrink-0 text-green-500" />
                Đưa camera sát vết bệnh (cách 10-15cm).
              </li>
              <li className="flex items-center text-green-900">
                <CheckCircleOutlined className="mr-2 shrink-0 text-green-500" />
                Chạm vào màn hình để lấy nét rõ vết xước/đốm.
              </li>
              <li className="flex items-center text-green-900">
                <CheckCircleOutlined className="mr-2 shrink-0 text-green-500" />
                Đảm bảo đủ ánh sáng, không bị bóng râm che khuất.
              </li>
            </ul>
          </div>

          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#16a34a]" />
              <p className="animate-pulse text-[14px] font-[600] text-green-700">
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
              className="rounded-xl bg-gray-50 transition-colors hover:border-green-500 hover:bg-green-50"
            >
              <p className="ant-upload-drag-icon flex justify-center p-4">
                <CameraOutlined
                  className="text-green-600 opacity-80"
                  style={{ fontSize: "36px" }}
                />
              </p>
              <p className="ant-upload-text font-medium text-gray-700">
                Nhấp hoặc kéo thả ảnh vào đây
              </p>
              <p className="ant-upload-hint text-gray-500">
                Hỗ trợ định dạng JPG, PNG
              </p>
            </AntdUpload.Dragger>
          )}

          {uploadError && (
            <div className="animate-in fade-in mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-[12.5px] text-red-700">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <span>{uploadError}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 flex animate-pulse items-start gap-2 rounded-lg border border-green-100 bg-green-50 p-3 text-[12.5px] text-green-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
