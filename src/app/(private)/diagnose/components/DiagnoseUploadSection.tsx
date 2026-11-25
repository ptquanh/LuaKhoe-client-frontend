import { message } from "antd";
import {
  Brain,
  Camera,
  ChevronDown,
  Compass,
  Loader2,
  MapPin,
  Search,
  Upload,
  X,
} from "lucide-react";
import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import {
  DENSITY_OPTIONS,
  GROWTH_OPTIONS,
  WATER_OPTIONS,
} from "@/constants/diagnose";
import { useActiveAiModels } from "@/hooks/useActiveAiModels";
import { useUserFields } from "@/hooks/useUserFields";
import { FieldParams } from "@/types/diagnose.type";

const LazyMapComponent = lazy(() => import("./MapComponent"));
const emptySubscribe = () => () => {};

interface DiagnoseUploadSectionProps {
  file: { raw: File; url: string } | null;
  onFileSelect: (f: File) => void;
  result: any;
  isLoading: boolean;
  description: string;
  setDescription: (val: string) => void;
  fieldDescription: string;
  setFieldDescription: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  suggestedTags: string[];
  fieldParams: FieldParams;
  setFieldParams: React.Dispatch<React.SetStateAction<FieldParams>>;
  gpsLat?: number;
  setGpsLat: (val: number | undefined) => void;
  gpsLng?: number;
  setGpsLng: (val: number | undefined) => void;
  fieldId?: string;
  setFieldId: (val: string | undefined) => void;
  modelVersionId?: string;
  setModelVersionId: (val: string | undefined) => void;
  handleReset: () => void;
  handleFullReset?: () => void;
  handlePredict: () => void;
}

export function DiagnoseUploadSection({
  file,
  onFileSelect,
  result,
  isLoading,
  description,
  setDescription,
  fieldDescription,
  setFieldDescription,
  selectedTags,
  setSelectedTags,
  suggestedTags,
  fieldParams,
  setFieldParams,
  gpsLat,
  setGpsLat,
  setGpsLng,
  gpsLng,
  fieldId,
  setFieldId,
  modelVersionId,
  setModelVersionId,
  handleReset,
  handlePredict,
}: DiagnoseUploadSectionProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const isUnfilled =
    !fieldParams.water &&
    !fieldParams.growth &&
    !fieldParams.density &&
    (fieldParams.fog === null || fieldParams.fog === undefined) &&
    (fieldParams.pesticide === null || fieldParams.pesticide === undefined);

  const { fields, isLoading: isFieldsLoading, createField } = useUserFields();
  const { data: activeModels = [], isLoading: isModelsLoading } =
    useActiveAiModels();

  const [locationMode, setLocationMode] = useState<
    "default" | "saved" | "custom"
  >("default");

  const loadingTexts = [
    "Đang tải ảnh lên máy chủ...",
    "AI đang phân tích triệu chứng trên lá...",
    "Đang đối chiếu với kho dữ liệu bệnh học...",
    "Đang tổng hợp phác đồ điều trị...",
  ];
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = setInterval(() => {
      setLoadingTextIdx((prev) => (prev + 1) % loadingTexts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLoading, loadingTexts.length]);

  useEffect(() => {
    if (activeModels.length > 0 && !modelVersionId) {
      setModelVersionId(activeModels[0].id);
    }
  }, [activeModels, modelVersionId, setModelVersionId]);

  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [currentProvince, setCurrentProvince] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  const defaultField = fields.find((f) => f.isDefault);

  useEffect(() => {
    if (fields.length > 0) {
      if (defaultField) {
        setLocationMode("default");
        setFieldId(defaultField.id);
        setGpsLat(Number(defaultField.gpsLat));
        setGpsLng(Number(defaultField.gpsLng));
      } else {
        setLocationMode("saved");
        setFieldId(fields[0].id);
        setGpsLat(Number(fields[0].gpsLat));
        setGpsLng(Number(fields[0].gpsLng));
      }
    } else {
      setLocationMode("custom");
      setFieldId(undefined);
    }
  }, [fields, defaultField, setFieldId, setGpsLat, setGpsLng]);

  useEffect(() => {
    if (gpsLat === undefined || gpsLng === undefined) return;

    const resolveProvince = async () => {
      setGeocoding(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsLat}&lon=${gpsLng}&accept-language=vi`,
        );
        const data = await response.json();
        if (data && data.address) {
          const resolvedProv =
            data.address.city ||
            data.address.state ||
            data.address.province ||
            data.address.town ||
            "";
          const cleanProv = resolvedProv
            .replace(/(Tỉnh|Thành phố|Thành\sphố\s|Tỉnh\s)/gi, "")
            .trim();
          setCurrentProvince(cleanProv || "Không xác định");
        }
      } catch (err) {
        console.error(err);
        setCurrentProvince("Không xác định");
      } finally {
        setGeocoding(false);
      }
    };

    const timer = setTimeout(resolveProvince, 800);
    return () => clearTimeout(timer);
  }, [gpsLat, gpsLng]);

  const handleSearchAddress = useCallback(async () => {
    if (!addressQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&countrycodes=vn&limit=1&accept-language=vi`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setGpsLat(lat);
        setGpsLng(lng);
        message.success("Định vị địa chỉ thành công!");
      } else {
        message.warning("Không tìm thấy địa chỉ. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tìm kiếm địa chỉ.");
    } finally {
      setIsSearching(false);
    }
  }, [addressQuery, setGpsLat, setGpsLng]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      message.error("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude);
        setGpsLng(pos.coords.longitude);
        setIsGettingLocation(false);
        message.success("Đã định vị vị trí ruộng hiện tại!");
      },
      (err) => {
        console.error(err);
        message.warning(
          "Chưa lấy được tọa độ. Đang sử dụng dữ liệu thời tiết mặc định.",
          5,
        );
        setIsGettingLocation(false);
      },
    );
  };

  const handlePredictWrapper = () => {
    if (
      locationMode === "custom" &&
      saveAsDefault &&
      gpsLat !== undefined &&
      gpsLng !== undefined
    ) {
      createField(
        {
          fieldName: `Ruộng chẩn đoán (${currentProvince || "Mới"})`,
          address: addressQuery || undefined,
          gpsLat,
          gpsLng,
          isDefault: fields.length === 0 || saveAsDefault,
        },
        () => {
          message.success("Đã lưu ruộng mới vào danh sách!");
        },
      );
    }
    handlePredict();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      onFileSelect(f);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      onFileSelect(f);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const updateFieldParam = (key: keyof FieldParams, value: any) => {
    setFieldParams((prev) => ({ ...prev, [key]: value }));
  };

  const activeLoadingText = isLoading
    ? loadingTexts[loadingTextIdx]
    : loadingTexts[0];

  return (
    <div className="flex flex-col gap-4">
      {!isMounted ? (
        <div className="bg-bg-subtle min-h-[260px] animate-pulse rounded-2xl sm:min-h-[300px]" />
      ) : !file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          className={`flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:min-h-[300px] sm:p-10 ${
            isDragging
              ? "border-primary bg-primary-light"
              : "border-border bg-bg-card hover:border-primary hover:bg-primary-light/30"
          }`}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="bg-primary-light mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Camera className="text-primary h-7 w-7" />
          </div>
          <h3 className="font-heading text-text-primary mb-1.5 text-lg font-semibold">
            Chụp hoặc kéo thả ảnh lá lúa
          </h3>
          <p className="text-text-secondary mb-6 text-sm">
            Hỗ trợ JPG, PNG, WEBP. Tối đa 10MB
          </p>
          <div className="flex w-full max-w-sm flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("camera-input")?.click();
              }}
              className="bg-primary hover:bg-primary-hover flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-xs transition-colors sm:flex-initial"
            >
              <Camera className="h-4 w-4" /> Chụp ảnh ngay
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("file-input")?.click();
              }}
              className="border-border bg-bg-card text-text-primary hover:bg-bg-hover flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors sm:flex-initial"
            >
              <Upload className="h-4 w-4" /> Chọn từ thư viện
            </button>
          </div>
        </div>
      ) : (
        <div className="border-border bg-bg-card overflow-hidden rounded-2xl border shadow-xs">
          <div className="bg-bg-subtle relative flex aspect-video w-full items-center justify-center p-2">
            <div className="absolute top-2.5 left-2.5 z-10 rounded-md bg-black/65 px-2.5 py-1 backdrop-blur-sm">
              <span className="text-[11px] font-semibold tracking-wide text-white uppercase">
                Ảnh gốc
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.url}
              alt="Preview"
              className="max-h-[300px] rounded-lg object-contain shadow-sm"
            />
            <button
              type="button"
              onClick={handleReset}
              aria-label="Xóa ảnh đã chọn"
              className="absolute top-2.5 right-2.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
            >
              <X className="h-4 w-4" />
            </button>
            {isLoading && (
              <div className="animate-in fade-in bg-bg-card/85 absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm duration-200">
                <Loader2 className="text-primary mb-3 h-8 w-8 animate-spin" />
                <p className="text-primary animate-pulse px-4 text-center text-sm font-bold transition-all duration-500">
                  {activeLoadingText}
                </p>
              </div>
            )}
          </div>

          <div className="border-border bg-bg-subtle/60 border-t p-4 sm:p-5">
            {/* Location Section */}
            <div className="mb-4">
              <label className="text-text-primary mb-2 block text-xs font-semibold tracking-wide uppercase">
                Vị trí ruộng chẩn đoán
              </label>

              {isFieldsLoading ? (
                <div className="border-border bg-bg-card flex h-16 items-center justify-center rounded-xl border">
                  <Loader2 className="text-primary h-5 w-5 animate-spin" />
                </div>
              ) : fields.length > 0 ? (
                <div className="border-border bg-bg-card flex flex-col gap-3.5 rounded-xl border p-3.5 shadow-xs">
                  {defaultField && (
                    <label className="flex cursor-pointer items-start gap-2.5">
                      <input
                        type="radio"
                        name="locationMode"
                        value="default"
                        checked={locationMode === "default"}
                        onChange={() => {
                          setLocationMode("default");
                          setFieldId(defaultField.id);
                          setGpsLat(Number(defaultField.gpsLat));
                          setGpsLng(Number(defaultField.gpsLng));
                        }}
                        className="accent-primary mt-1 h-4 w-4 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <span className="text-text-primary text-sm font-semibold">
                          Sử dụng ruộng mặc định ({defaultField.fieldName})
                        </span>
                        <p className="text-text-secondary text-xs tabular-nums">
                          Địa chỉ: {defaultField.address || "Chưa xác định"} |
                          Tọa độ: {Number(defaultField.gpsLat).toFixed(5)},{" "}
                          {Number(defaultField.gpsLng).toFixed(5)}
                        </p>
                      </div>
                    </label>
                  )}

                  <div
                    className={`flex flex-col gap-2 ${defaultField ? "border-border border-t pt-3" : ""}`}
                  >
                    <label className="flex cursor-pointer items-start gap-2.5">
                      <input
                        type="radio"
                        name="locationMode"
                        value="saved"
                        checked={locationMode === "saved"}
                        onChange={() => {
                          setLocationMode("saved");
                          const selected = fields[0];
                          if (selected) {
                            setFieldId(selected.id);
                            setGpsLat(Number(selected.gpsLat));
                            setGpsLng(Number(selected.gpsLng));
                          }
                        }}
                        className="accent-primary mt-1.5 h-4 w-4 cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-text-primary text-sm font-semibold">
                          Chọn từ danh sách ruộng đã lưu
                        </span>
                        {locationMode === "saved" && (
                          <div className="animate-in fade-in slide-in-from-top-1 mt-2">
                            <select
                              value={fieldId}
                              onChange={(e) => {
                                const id = e.target.value;
                                setFieldId(id);
                                const match = fields.find((f) => f.id === id);
                                if (match) {
                                  setGpsLat(Number(match.gpsLat));
                                  setGpsLng(Number(match.gpsLng));
                                }
                              }}
                              className="border-border bg-bg-card text-text-primary focus:border-primary min-h-10 w-full rounded-xl border px-3 py-2 text-base font-medium focus:outline-none sm:text-sm"
                            >
                              {fields.map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.fieldName} (
                                  {f.address ||
                                    `${Number(f.gpsLat).toFixed(4)}, ${Number(f.gpsLng).toFixed(4)}`}
                                  )
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  <label className="border-border flex cursor-pointer items-start gap-2.5 border-t pt-3">
                    <input
                      type="radio"
                      name="locationMode"
                      value="custom"
                      checked={locationMode === "custom"}
                      onChange={() => {
                        setLocationMode("custom");
                        setFieldId(undefined);
                      }}
                      className="accent-primary mt-1 h-4 w-4 cursor-pointer"
                    />
                    <div>
                      <span className="text-text-primary text-sm font-semibold">
                        Chẩn đoán tại vị trí mới (Chưa lưu)
                      </span>
                      <p className="text-text-secondary text-xs">
                        Chọn vị trí mới trên bản đồ hoặc định vị trực tiếp ngoài
                        ruộng
                      </p>
                    </div>
                  </label>
                </div>
              ) : fields.length === 0 &&
                gpsLat === undefined &&
                gpsLng === undefined ? (
                <div className="border-warning/30 bg-accent-light/50 text-accent rounded-xl border p-3.5">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-xs leading-relaxed font-medium">
                      Bạn chưa lưu vị trí ruộng nào. Vui lòng ghim vị trí ruộng
                      trên bản đồ hoặc định vị GPS để chẩn đoán.
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Collapsible custom map container */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  locationMode === "custom"
                    ? "max-h-[600px] opacity-100"
                    : "pointer-events-none max-h-0 opacity-0"
                }`}
              >
                <div className="mt-4 space-y-3">
                  <div className="text-text-secondary flex items-center justify-between text-xs font-medium">
                    <span>Tìm hoặc chọn trên bản đồ:</span>
                    <button
                      onClick={handleGetCurrentLocation}
                      type="button"
                      disabled={isGettingLocation}
                      className="text-primary flex min-h-9 cursor-pointer items-center gap-1.5 font-semibold hover:underline"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Compass className="h-4 w-4" />
                      )}
                      Lấy GPS thiết bị
                    </button>
                  </div>

                  {/* Address search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nhập địa chỉ để định vị nhanh..."
                      value={addressQuery}
                      onChange={(e) => setAddressQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchAddress();
                      }}
                      className="border-border bg-bg-card text-text-primary placeholder:text-text-muted focus:border-primary min-h-11 w-full rounded-xl border py-2 pr-12 pl-3.5 text-base focus:outline-none sm:min-h-10 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleSearchAddress}
                      disabled={isSearching}
                      aria-label="Tìm kiếm địa chỉ"
                      className="bg-primary hover:bg-primary-hover absolute top-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white disabled:opacity-50 sm:h-8 sm:w-8"
                    >
                      {isSearching ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Map container */}
                  <div className="border-border overflow-hidden rounded-xl border shadow-sm">
                    <Suspense
                      fallback={
                        <div className="bg-bg-subtle flex h-[280px] w-full items-center justify-center">
                          <Loader2 className="text-primary h-6 w-6 animate-spin" />
                        </div>
                      }
                    >
                      <LazyMapComponent
                        gpsLat={gpsLat}
                        gpsLng={gpsLng}
                        setGpsLat={setGpsLat}
                        setGpsLng={setGpsLng}
                      />
                    </Suspense>
                  </div>

                  {gpsLat !== undefined && gpsLng !== undefined && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-3">
                      <div className="border-primary-border bg-primary-light/60 text-primary rounded-xl border p-3 text-xs tabular-nums">
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          Đã ghim vị trí ruộng:
                        </span>{" "}
                        {gpsLat.toFixed(6)}, {gpsLng.toFixed(6)}{" "}
                        <span className="text-text-primary mt-0.5 block font-semibold">
                          Khu vực:{" "}
                          {geocoding ? "Đang xác định..." : currentProvince}
                        </span>
                      </div>

                      <label className="border-border-strong bg-bg-card hover:bg-bg-hover flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-dashed p-3 transition-colors">
                        <input
                          type="checkbox"
                          checked={saveAsDefault}
                          onChange={(e) => setSaveAsDefault(e.target.checked)}
                          className="accent-primary h-4 w-4 cursor-pointer rounded"
                        />
                        <span className="text-text-primary text-xs font-medium">
                          Lưu vị trí này làm ruộng mặc định của tôi
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Model Selection */}
            <div className="mb-4">
              <label className="text-text-primary mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                <Brain className="text-primary h-4 w-4" />
                Phiên bản mô hình AI chẩn đoán
              </label>
              {isModelsLoading ? (
                <div className="border-border bg-bg-card flex h-11 items-center justify-center rounded-xl border">
                  <Loader2 className="text-primary h-4 w-4 animate-spin" />
                </div>
              ) : activeModels.length > 0 ? (
                <select
                  value={modelVersionId}
                  onChange={(e) => setModelVersionId(e.target.value)}
                  className="border-border bg-bg-card text-text-primary focus:border-primary min-h-11 w-full cursor-pointer rounded-xl border px-3.5 py-2 text-base font-medium shadow-xs transition-colors focus:outline-none sm:min-h-10 sm:text-sm"
                >
                  {activeModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.versionName}{" "}
                      {model.releaseNotes ? `(${model.releaseNotes})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="border-warning/30 bg-accent-light/50 text-accent rounded-xl border p-3.5 text-xs font-medium">
                  Không tìm thấy mô hình AI hoạt động nào trong hệ thống.
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="text-text-primary mb-0.5 block text-sm font-semibold">
                Mô tả triệu chứng (Tùy chọn)
              </label>
              <p className="text-text-secondary mb-2 text-xs">
                Dùng để AI đưa ra lời khuyên điều trị chính xác hơn. Không ảnh
                hưởng đến kết quả nhận diện bệnh.
              </p>
              <textarea
                value={fieldDescription}
                onChange={(e) => setFieldDescription(e.target.value)}
                placeholder="Ví dụ: Mép lá xuất hiện vết héo màu xanh xám, lan nhanh từ chóp lá xuống..."
                rows={2}
                className="border-border bg-bg-card text-text-primary placeholder:text-text-muted focus:border-primary w-full resize-none rounded-xl border px-3 py-2 text-base focus:outline-none sm:text-sm"
              />
            </div>

            <label className="text-text-primary mb-2 block text-sm font-semibold">
              Nhãn triệu chứng nhanh
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`min-h-9 cursor-pointer rounded-full px-3 text-xs font-medium transition-colors sm:text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-white"
                      : "border-border bg-bg-card text-text-secondary hover:bg-bg-hover border"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-text-primary mb-0.5 block text-sm font-semibold">
                Mô tả thời tiết hôm nay (Tùy chọn)
              </label>
              <p className="text-text-secondary mb-2 text-xs">
                Bổ sung nếu thời tiết bất thường. Hệ thống tự động lấy dữ liệu
                thời tiết theo vị trí ruộng.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Sáng có sương mù dày, chiều nắng gắt, độ ẩm cao bất thường..."
                rows={2}
                className="border-border bg-bg-card text-text-primary placeholder:text-text-muted focus:border-primary w-full resize-none rounded-xl border px-3 py-2 text-base focus:outline-none sm:text-sm"
              />
            </div>

            {/* Field Params Accordion */}
            <div className="border-border bg-bg-card mb-6 overflow-hidden rounded-xl border">
              <button
                type="button"
                onClick={() => setShowAdvance(!showAdvance)}
                className="text-text-primary hover:bg-bg-hover flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm font-semibold transition-colors"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span>Thông số thực địa (Tăng độ chính xác)</span>
                  {isUnfilled && (
                    <span className="bg-accent-light text-accent rounded-full px-2 py-0.5 text-[11px] font-medium">
                      Chưa điền — dùng mặc định
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={`text-text-secondary h-4 w-4 shrink-0 transition-transform ${showAdvance ? "rotate-180" : ""}`}
                />
              </button>

              {showAdvance && (
                <div className="border-border grid grid-cols-1 gap-4 border-t p-3.5 md:grid-cols-2">
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs font-medium">
                      Trạng thái nước
                    </label>
                    <select
                      value={fieldParams.water ?? ""}
                      onChange={(e) =>
                        updateFieldParam("water", e.target.value || undefined)
                      }
                      className="border-border bg-bg-card text-text-primary focus:ring-primary min-h-10 w-full rounded-lg border px-2.5 py-1.5 text-base focus:ring-1 focus:outline-none sm:text-sm"
                    >
                      <option value="">-- Chọn tình trạng --</option>
                      {WATER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs font-medium">
                      Giai đoạn sinh trưởng
                    </label>
                    <select
                      value={fieldParams.growth ?? ""}
                      onChange={(e) =>
                        updateFieldParam("growth", e.target.value || undefined)
                      }
                      className="border-border bg-bg-card text-text-primary focus:ring-primary min-h-10 w-full rounded-lg border px-2.5 py-1.5 text-base focus:ring-1 focus:outline-none sm:text-sm"
                    >
                      <option value="">-- Chọn giai đoạn --</option>
                      {GROWTH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs font-medium">
                      Mật độ gieo sạ
                    </label>
                    <select
                      value={fieldParams.density ?? ""}
                      onChange={(e) =>
                        updateFieldParam("density", e.target.value || undefined)
                      }
                      className="border-border bg-bg-card text-text-primary focus:ring-primary min-h-10 w-full rounded-lg border px-2.5 py-1.5 text-base focus:ring-1 focus:outline-none sm:text-sm"
                    >
                      <option value="">-- Chọn mật độ --</option>
                      {DENSITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-full grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          fieldParams.fog === null ||
                          fieldParams.fog === undefined
                        )
                          updateFieldParam("fog", true);
                        else if (fieldParams.fog === true)
                          updateFieldParam("fog", false);
                        else updateFieldParam("fog", null);
                      }}
                      className={`flex min-h-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border p-2 transition-colors ${
                        fieldParams.fog === null ||
                        fieldParams.fog === undefined
                          ? "border-border bg-bg-card text-text-muted"
                          : fieldParams.fog
                            ? "border-primary bg-primary-light text-primary"
                            : "border-error/40 bg-error/10 text-error"
                      }`}
                    >
                      <span className="text-xs font-semibold">Sương mù</span>
                      <span className="text-[11px]">
                        {fieldParams.fog === null ||
                        fieldParams.fog === undefined
                          ? "Chưa chọn"
                          : fieldParams.fog
                            ? "Có"
                            : "Không"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          fieldParams.pesticide === null ||
                          fieldParams.pesticide === undefined
                        )
                          updateFieldParam("pesticide", true);
                        else if (fieldParams.pesticide === true)
                          updateFieldParam("pesticide", false);
                        else updateFieldParam("pesticide", null);
                      }}
                      className={`flex min-h-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border p-2 transition-colors ${
                        fieldParams.pesticide === null ||
                        fieldParams.pesticide === undefined
                          ? "border-border bg-bg-card text-text-muted"
                          : fieldParams.pesticide
                            ? "border-primary bg-primary-light text-primary"
                            : "border-error/40 bg-error/10 text-error"
                      }`}
                    >
                      <span className="text-xs font-semibold">
                        Đã phun thuốc
                      </span>
                      <span className="text-[11px]">
                        {fieldParams.pesticide === null ||
                        fieldParams.pesticide === undefined
                          ? "Chưa chọn"
                          : fieldParams.pesticide
                            ? "Rồi"
                            : "Chưa"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="border-border bg-bg-card text-text-secondary hover:bg-bg-hover min-h-12 flex-1 cursor-pointer rounded-xl border text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              {!result && (
                <button
                  type="button"
                  onClick={handlePredictWrapper}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-hover min-h-12 flex-1 cursor-pointer rounded-xl text-sm font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...
                    </span>
                  ) : (
                    "Phân tích ngay"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
