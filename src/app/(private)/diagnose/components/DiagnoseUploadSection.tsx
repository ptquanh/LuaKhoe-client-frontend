import {
  DENSITY_OPTIONS,
  GROWTH_OPTIONS,
  WATER_OPTIONS,
} from "@/constants/diagnose";
import { useActiveAiModels } from "@/hooks/useActiveAiModels";
import { useUserFields } from "@/hooks/useUserFields";
import { FieldParams } from "@/types/diagnose.type";
import { message } from "antd";
import {
  Brain,
  ChevronDown,
  Compass,
  Loader2,
  Search,
  Upload,
  X,
} from "lucide-react";
import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";

const LazyMapComponent = lazy(() => import("./MapComponent"));

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
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Default Location UX states
  const { fields, isLoading: isFieldsLoading, createField } = useUserFields();
  const { data: activeModels = [], isLoading: isModelsLoading } =
    useActiveAiModels();

  const [locationMode, setLocationMode] = useState<
    "default" | "saved" | "custom"
  >("default");

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
    setIsMounted(true);
  }, []);

  // Sync mode with fields load
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

  // Track coordinates reverse geocoding to resolve province
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

  return (
    <div className="flex flex-col gap-4 font-[Inter,sans-serif]">
      {!isMounted ? (
        <div className="min-h-[320px] animate-pulse rounded-xl bg-black/5" />
      ) : !file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          className={`flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? "border-[#2F9E44] bg-[#E6F4EA]"
              : "border-[#E0E0E0] bg-white hover:border-[#2F9E44] hover:bg-[#E6F4EA]/30"
          }`}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F4EA]">
            <Upload className="h-7 w-7 text-[#2F9E44]" />
          </div>
          <h3 className="mb-2 text-[18px] font-[600] text-[#1B1B1B]">
            Kéo thả hoặc chọn file
          </h3>
          <p className="mb-6 text-[14px] text-[#5C5C5C]">
            Hỗ trợ JPG, PNG, WEBP. Tối đa 10MB
          </p>
          <button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 text-[14px] text-white hover:bg-[#1F6F2E]">
            <Upload className="h-4 w-4" /> Chọn ảnh
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-xs">
          <div className="relative flex aspect-video w-full items-center justify-center bg-black/5 p-2">
            <div className="absolute top-2 left-2 z-10 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
              <span className="text-[11px] font-[600] tracking-wide text-white uppercase">
                Ảnh gốc
              </span>
            </div>
            <img
              src={file.url}
              alt="Preview"
              className="max-h-[300px] rounded-lg object-contain shadow-sm"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#2F9E44]" />
                <p className="text-[14px] font-[500] text-[#2F9E44]">
                  AI đang phân tích hình ảnh...
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-[#E0E0E0] bg-[#FAFAFA] p-4">
            {/* Location Section */}
            <div className="mb-4">
              <label className="mb-2 block text-[13px] font-[600] text-[#1B1B1B]">
                Vị trí ruộng chẩn đoán
              </label>

              {isFieldsLoading ? (
                <div className="flex h-16 items-center justify-center rounded-xl border border-[#E0E0E0] bg-white">
                  <Loader2 className="h-5 w-5 animate-spin text-[#2F9E44]" />
                </div>
              ) : fields.length > 0 ? (
                <div className="flex flex-col gap-3.5 rounded-xl border border-[#E0E0E0] bg-white p-3.5 shadow-xs">
                  {/* Option 1: Default Location */}
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
                        className="mt-1 h-4 w-4 cursor-pointer accent-[#2F9E44]"
                      />
                      <div>
                        <span className="text-[13px] font-[600] text-[#1B1B1B]">
                          Sử dụng ruộng mặc định ({defaultField.fieldName})
                        </span>
                        <p className="text-[11px] text-[#5C5C5C]">
                          Địa chỉ: {defaultField.address || "Chưa xác định"} |
                          Tọa độ: {Number(defaultField.gpsLat).toFixed(5)},{" "}
                          {Number(defaultField.gpsLng).toFixed(5)}
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Option 2: Select from Saved Fields */}
                  <div
                    className={`flex flex-col gap-2 ${defaultField ? "border-t border-gray-100 pt-3" : ""}`}
                  >
                    <label className="flex cursor-pointer items-start gap-2.5">
                      <input
                        type="radio"
                        name="locationMode"
                        value="saved"
                        checked={locationMode === "saved"}
                        onChange={() => {
                          setLocationMode("saved");
                          // Find first field to select
                          const selected = fields[0];
                          if (selected) {
                            setFieldId(selected.id);
                            setGpsLat(Number(selected.gpsLat));
                            setGpsLng(Number(selected.gpsLng));
                          }
                        }}
                        className="mt-1.5 h-4 w-4 cursor-pointer accent-[#2F9E44]"
                      />
                      <div className="flex-1">
                        <span className="text-[13px] font-[600] text-[#1B1B1B]">
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
                              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-2.5 py-1.5 text-[12.5px] font-[500] text-gray-700 focus:border-[#2F9E44] focus:outline-none"
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

                  {/* Option 3: Pin New Location */}
                  <label className="flex cursor-pointer items-start gap-2.5 border-t border-gray-100 pt-3">
                    <input
                      type="radio"
                      name="locationMode"
                      value="custom"
                      checked={locationMode === "custom"}
                      onChange={() => {
                        setLocationMode("custom");
                        setFieldId(undefined);
                      }}
                      className="mt-1 h-4 w-4 cursor-pointer accent-[#2F9E44]"
                    />
                    <div>
                      <span className="text-[13px] font-[600] text-[#1B1B1B]">
                        Chẩn đoán tại vị trí mới (Chưa lưu)
                      </span>
                      <p className="text-[11px] text-[#5C5C5C]">
                        Chọn vị trí mới trên bản đồ hoặc định vị trực tiếp ngoài
                        ruộng
                      </p>
                    </div>
                  </label>
                </div>
              ) : fields.length === 0 && gpsLat === undefined && gpsLng === undefined ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 text-amber-800">
                  <div className="flex gap-2">
                    <span className="text-base">📍</span>
                    <span className="text-[12px] font-[500]">
                      Bạn chưa lưu vị trí ruộng nào. Vui lòng ghim vị trí ruộng
                      trên bản đồ hoặc định vị GPS để chẩn đoán.
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Collapsible custom map container using smooth Tailwind transitions */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  locationMode === "custom"
                    ? "max-h-[580px] opacity-100"
                    : "pointer-events-none max-h-0 opacity-0"
                }`}
              >
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-[12px] font-[500] text-[#5C5C5C]">
                    <span>Tìm hoặc chọn trên bản đồ:</span>
                    <button
                      onClick={handleGetCurrentLocation}
                      type="button"
                      disabled={isGettingLocation}
                      className="flex cursor-pointer items-center gap-1 font-[600] text-[#2F9E44] hover:underline"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Compass className="h-3.5 w-3.5" />
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
                      className="w-full rounded-xl border border-[#E0E0E0] bg-white py-2 pr-12 pl-3.5 text-[13px] focus:border-[#2F9E44] focus:outline-none"
                    />
                    <button
                      onClick={handleSearchAddress}
                      disabled={isSearching}
                      className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#2F9E44] text-white hover:bg-[#1F6F2E] disabled:opacity-50"
                    >
                      {isSearching ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Map container */}
                  <div className="overflow-hidden rounded-xl border border-[#E0E0E0] shadow-sm">
                    <Suspense
                      fallback={
                        <div className="flex h-[280px] w-full items-center justify-center bg-gray-50">
                          <Loader2 className="h-6 w-6 animate-spin text-[#2F9E44]" />
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

                  {/* Geolocation status / coordinates display */}
                  {gpsLat !== undefined && gpsLng !== undefined && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-3">
                      <div className="rounded-lg border border-[#E6F4EA] bg-[#E6F4EA]/30 p-3 text-[12.5px] text-[#2E7D32]">
                        <span className="font-[600]">
                          📍 Đã ghim vị trí ruộng:{" "}
                        </span>
                        {gpsLat.toFixed(6)}, {gpsLng.toFixed(6)}{" "}
                        <span className="mt-0.5 block font-semibold text-[#1B1B1B]">
                          Khu vực:{" "}
                          {geocoding ? "Đang xác định..." : currentProvince}
                        </span>
                      </div>

                      {/* Save Location Checkbox */}
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={saveAsDefault}
                          onChange={(e) => setSaveAsDefault(e.target.checked)}
                          className="h-4 w-4 cursor-pointer rounded accent-[#2F9E44]"
                        />
                        <span className="text-[12.5px] font-[500] text-[#1B1B1B]">
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
              <label className="mb-2 flex items-center gap-1.5 text-[13px] font-[600] text-[#1B1B1B]">
                <Brain className="h-4 w-4 text-[#2F9E44]" />
                Phiên bản mô hình AI chẩn đoán
              </label>
              {isModelsLoading ? (
                <div className="flex h-10 items-center justify-center rounded-xl border border-[#E0E0E0] bg-white">
                  <Loader2 className="h-4 w-4 animate-spin text-[#2F9E44]" />
                </div>
              ) : activeModels.length > 0 ? (
                <select
                  value={modelVersionId}
                  onChange={(e) => setModelVersionId(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-[#E0E0E0] bg-white px-3.5 py-2.5 text-[13px] font-[500] text-gray-700 shadow-xs transition-colors focus:border-[#2F9E44] focus:outline-none"
                >
                  {activeModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.versionName}{" "}
                      {model.releaseNotes ? `(${model.releaseNotes})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 text-[12px] font-[500] text-amber-800">
                  Không tìm thấy mô hình AI hoạt động nào trong hệ thống.
                </div>
              )}
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-[600] text-[#1B1B1B]">
                  Thông số môi trường (Tùy chọn)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ví dụ: Nóng ẩm, nắng gắt, có sương mù nhẹ buổi sáng..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[13px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-[600] text-[#1B1B1B]">
                  Mô tả triệu chứng & Thực địa (Tùy chọn)
                </label>
                <textarea
                  value={fieldDescription}
                  onChange={(e) => setFieldDescription(e.target.value)}
                  placeholder="Ví dụ: Mép lá xuất hiện vết héo màu xanh xám, lan nhanh..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[13px] focus:border-[#2F9E44] focus:outline-none"
                />
              </div>
            </div>

            <label className="mb-2 block text-[13px] font-[600] text-[#1B1B1B]">
              Nhãn triệu chứng nhanh
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`h-7 cursor-pointer rounded-full px-2.5 text-[12px] font-[500] transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-[#2F9E44] text-white"
                      : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Field Params Accordion */}
            <div className="mb-6 overflow-hidden rounded-lg border border-[#E0E0E0] bg-white">
              <button
                onClick={() => setShowAdvance(!showAdvance)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-[13px] font-[600] text-[#1B1B1B] hover:bg-[#F8F9FA]"
              >
                <span>Thông số thực địa (Tăng độ chính xác)</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showAdvance ? "rotate-180" : ""}`}
                />
              </button>

              {showAdvance && (
                <div className="grid grid-cols-1 gap-4 border-t border-[#E0E0E0] p-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[12px] font-[500] text-[#5C5C5C]">
                      Trạng thái nước
                    </label>
                    <select
                      value={fieldParams.water}
                      onChange={(e) =>
                        updateFieldParam("water", e.target.value)
                      }
                      className="w-full rounded-md border border-[#E0E0E0] px-2 py-1.5 text-[12px] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none"
                    >
                      {WATER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-[500] text-[#5C5C5C]">
                      Giai đoạn sinh trưởng
                    </label>
                    <select
                      value={fieldParams.growth}
                      onChange={(e) =>
                        updateFieldParam("growth", e.target.value)
                      }
                      className="w-full rounded-md border border-[#E0E0E0] px-2 py-1.5 text-[12px] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none"
                    >
                      {GROWTH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-[500] text-[#5C5C5C]">
                      Mật độ gieo sạ
                    </label>
                    <select
                      value={fieldParams.density}
                      onChange={(e) =>
                        updateFieldParam("density", e.target.value)
                      }
                      className="w-full rounded-md border border-[#E0E0E0] px-2 py-1.5 text-[12px] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none"
                    >
                      {DENSITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-full grid grid-cols-3 gap-2 pt-2">
                    <button
                      onClick={() => updateFieldParam("fog", !fieldParams.fog)}
                      className={`flex flex-col items-center gap-1 rounded-md border p-2 transition-colors ${fieldParams.fog ? "border-[#2F9E44] bg-[#E6F4EA] text-[#2F9E44]" : "border-[#E0E0E0] bg-white text-[#5C5C5C]"}`}
                    >
                      <span className="text-[11px] font-[600]">Sương mù</span>
                      <span className="text-[10px]">
                        {fieldParams.fog ? "Có" : "Không"}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        updateFieldParam("leafhopper", !fieldParams.leafhopper)
                      }
                      className={`flex flex-col items-center gap-1 rounded-md border p-2 transition-colors ${fieldParams.leafhopper ? "border-[#2F9E44] bg-[#E6F4EA] text-[#2F9E44]" : "border-[#E0E0E0] bg-white text-[#5C5C5C]"}`}
                    >
                      <span className="text-[11px] font-[600]">Rầy nâu</span>
                      <span className="text-[10px]">
                        {fieldParams.leafhopper ? "Có" : "Không"}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        updateFieldParam("pesticide", !fieldParams.pesticide)
                      }
                      className={`flex flex-col items-center gap-1 rounded-md border p-2 transition-colors ${fieldParams.pesticide ? "border-[#2F9E44] bg-[#E6F4EA] text-[#2F9E44]" : "border-[#E0E0E0] bg-white text-[#5C5C5C]"}`}
                    >
                      <span className="text-[11px] font-[600]">
                        Đã phun thuốc
                      </span>
                      <span className="text-[10px]">
                        {fieldParams.pesticide ? "Rồi" : "Chưa"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="h-11 flex-1 cursor-pointer rounded-lg border border-[#E0E0E0] text-[15px] font-[500] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] disabled:opacity-50"
              >
                Hủy
              </button>
              {!result && (
                <button
                  onClick={handlePredictWrapper}
                  disabled={isLoading}
                  className="h-11 flex-1 cursor-pointer rounded-lg bg-[#2F9E44] text-[15px] font-[500] text-white transition-colors hover:bg-[#1F6F2E] disabled:opacity-50"
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
