import { WATER_OPTIONS, GROWTH_OPTIONS, DENSITY_OPTIONS } from "@/constants/diagnose";
import { FieldParams } from "@/types/diagnose.type";
import { message } from "antd";
import { ChevronDown, Loader2, MapPin, Search, Upload, X } from "lucide-react";
import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";

const LazyMapComponent = lazy(() => import("./MapComponent"));

interface DiagnoseUploadSectionProps {
  file: { raw: File; url: string } | null;
  onFileSelect: (f: File) => void;
  result: any;
  isLoading: boolean;
  description: string;
  setDescription: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  suggestedTags: string[];
  fieldParams: FieldParams;
  setFieldParams: React.Dispatch<React.SetStateAction<FieldParams>>;
  gpsLat?: number;
  setGpsLat: (val: number | undefined) => void;
  gpsLng?: number;
  setGpsLng: (val: number | undefined) => void;
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
  selectedTags,
  setSelectedTags,
  suggestedTags,
  fieldParams,
  setFieldParams,
  gpsLat,
  setGpsLat,
  gpsLng,
  setGpsLng,
  handleReset,
  handlePredict,
}: DiagnoseUploadSectionProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchAddress = useCallback(async () => {
    if (!addressQuery.trim()) return;
    setIsSearching(true);
    setShowMap(true);
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
        // MapComponent will handle reverse geocoding and province updates
      } else {
        alert("Không tìm thấy địa chỉ. Vui lòng thử lại với từ khóa khác.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tìm kiếm địa chỉ.");
    } finally {
      setIsSearching(false);
    }
  }, [addressQuery, setGpsLat, setGpsLng]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    setIsGettingLocation(true);
    setShowMap(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude);
        setGpsLng(pos.coords.longitude);
        setIsGettingLocation(false);
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
    <div className="flex flex-col gap-4">
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
        <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
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
              <div className="mb-1.5 flex items-center justify-between text-[13px] font-[600] text-[#1B1B1B]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#2F9E44]" /> Vị trí ruộng
                </div>
                <button
                  onClick={handleGetCurrentLocation}
                  type="button"
                  disabled={isGettingLocation}
                  className="flex cursor-pointer items-center gap-1 text-[11px] font-[500] text-[#2F9E44] hover:underline"
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  Lấy vị trí hiện tại
                </button>
              </div>

              {/* Address search */}
              <div className="relative mb-3">
                <div className="group relative">
                  <input
                    type="text"
                    placeholder="Tìm địa chỉ: VD 'Cần Thơ', 'Phong Điền', ..."
                    value={addressQuery}
                    onChange={(e) => setAddressQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchAddress();
                    }}
                    className="w-full rounded-xl border border-[#E0E0E0] bg-white py-2.5 pr-20 pl-4 text-[13px] transition-all focus:border-[#2F9E44] focus:ring-2 focus:ring-[#2F9E44]/10 focus:outline-none"
                  />
                  <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                    {addressQuery && (
                      <button
                        onClick={() => setAddressQuery("")}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[#5C5C5C] hover:bg-[#F0F2F5] hover:text-[#1B1B1B]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={handleSearchAddress}
                      disabled={isSearching}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2F9E44] text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {isSearching ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div
                className={`overflow-hidden transition-all duration-300 ${showMap ? "mb-3 opacity-100" : "h-0 opacity-0"}`}
              >
                <Suspense
                  fallback={
                    <div className="flex h-[350px] items-center justify-center rounded-xl border border-[#E0E0E0] bg-[#F8F9FA]">
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

              {!showMap && (
                <button
                  onClick={() => setShowMap(true)}
                  className="mb-3 w-full cursor-pointer rounded-xl border border-dashed border-[#E0E0E0] bg-white py-4 text-[13px] font-[500] text-[#5C5C5C] transition-all hover:border-[#2F9E44] hover:bg-[#E6F4EA]/20 hover:text-[#2F9E44]"
                >
                  <MapPin className="mr-2 inline h-4 w-4" /> Mở bản đồ để chọn
                  vị trí chính xác
                </button>
              )}

              {/* Display selected coordinates */}
              {gpsLat !== undefined && gpsLng !== undefined && (
                <div className="animate-in fade-in slide-in-from-top-2 mb-2 flex flex-col gap-1.5 rounded-xl border border-[#E6F4EA] bg-[#E6F4EA]/30 p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F9E44] text-white">
                      <MapPin className="h-3 w-3" />
                    </div>
                    <p className="text-[13px] font-[600] text-[#1B1B1B]">
                      Đã ghim vị trí ruộng
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pl-7">
                    <p className="text-[11px] font-[500] text-[#5C5C5C]">
                      Tọa độ:{" "}
                      <span className="text-[#1B1B1B]">
                        {gpsLat.toFixed(6)}, {gpsLng.toFixed(6)}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <p className="mt-2 text-[11px] leading-relaxed text-[#5C5C5C]">
                * Nhấn trực tiếp vào bản đồ hoặc kéo ghim để cập nhật vị trí. Hệ
                thống sẽ tự động đồng bộ hóa dữ liệu vùng miền.
              </p>
            </div>

            <label className="mb-2 block text-[13px] font-[600] text-[#1B1B1B]">
              Mô tả triệu chứng (Tùy chọn)
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
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Lá bị đốm nâu ở rìa, lan dần vào trong..."
              rows={2}
              className="mb-4 w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[13px] focus:border-[#2F9E44] focus:outline-none"
            />

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
                  onClick={handlePredict}
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
