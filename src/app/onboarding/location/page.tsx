"use client";

import { message } from "antd";
import { ArrowRight, Check, Compass, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { lazy, Suspense, useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const LazyMapComponent = lazy(
  () => import("../../(private)/diagnose/components/MapComponent"),
);

export default function OnboardingLocationPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { updateProfile, isUpdating } = useProfile();

  const [gpsLat, setGpsLat] = useState<number | undefined>(undefined);
  const [gpsLng, setGpsLng] = useState<number | undefined>(undefined);
  const [province, setProvince] = useState<string>("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  // Redirect if not logged in or doesn't have password
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push(ROUTES.LOGIN);
      } else if (!user.hasPassword) {
        router.push("/onboarding/password");
      }
    }
  }, [user, isAuthLoading, router]);

  // Fetch province when lat/lng changes
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
          // Normalize province name
          const cleanProv = resolvedProv
            .replace(/(Tỉnh|Thành phố|Thành\sphố\s|Tỉnh\s)/gi, "")
            .trim();
          setProvince(cleanProv || "Không xác định");
        }
      } catch (err) {
        console.error(err);
        setProvince("Không xác định");
      } finally {
        setGeocoding(false);
      }
    };

    resolveProvince();
  }, [gpsLat, gpsLng]);

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
      },
      (err) => {
        console.error(err);
        message.warning(
          "Không thể lấy vị trí hiện tại. Vui lòng chọn trên bản đồ.",
        );
        setIsGettingLocation(false);
      },
    );
  };

  const handleSaveLocation = async () => {
    if (gpsLat === undefined || gpsLng === undefined) {
      message.error("Vui lòng chọn vị trí ruộng của bạn trên bản đồ.");
      return;
    }

    await updateProfile(
      {
        defaultGpsLat: gpsLat,
        defaultGpsLng: gpsLng,
        defaultProvince: province,
      },
      () => {
        message.success("Lưu vị trí ruộng mặc định thành công!");
        if (user) {
          localStorage.setItem(`onboarding_skipped_${user.id}`, "true");
        }
        router.push(ROUTES.DIAGNOSE);
      },
    );
  };

  const handleSkip = () => {
    if (user) {
      localStorage.setItem(`onboarding_skipped_${user.id}`, "true");
    }
    router.push(ROUTES.DIAGNOSE);
  };

  if (isAuthLoading || !user || !user.hasPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2F9E44]" />
          <p className="mt-2 text-[14px] text-[#5C5C5C]">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F6F8] px-4 py-8 font-[Inter,sans-serif]">
      <div className="w-full max-w-[620px] rounded-2xl border border-gray-200/50 bg-white p-6 shadow-xl transition-all md:p-8">
        {/* Progress header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-[16px] font-[700] text-[#1F6F2E]">
              Lúa Khoẻ Onboarding
            </span>
          </div>
          <span className="rounded-full bg-[#E6F4EA] px-2.5 py-0.5 text-[11px] font-[600] text-[#2F9E44]">
            Bước 2 / 2
          </span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-[24px] font-[700] tracking-tight text-[#1B1B1B]">
            Thiết lập vị trí ruộng mặc định
          </h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#5C5C5C]">
            Chọn vị trí ruộng lúa của bạn để hệ thống tự động tải dữ liệu thời
            tiết, dự báo dịch bệnh nông nghiệp chính xác nhất mà không cần định
            vị mỗi lần quét.
          </p>
        </div>

        {/* Location setup block */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#2F9E44] bg-white text-[14px] font-[600] text-[#2F9E44] transition-all hover:bg-[#E6F4EA]/20 disabled:opacity-50"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Compass className="h-4 w-4" />
              )}
              Lấy vị trí hiện tại
            </button>
            <button
              onClick={() => {
                // Default coordinates for An Giang center if not set
                setGpsLat(10.3759);
                setGpsLng(105.4246);
              }}
              className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-gray-300 px-4 text-[14px] font-[500] text-[#5C5C5C] transition-all hover:bg-gray-50"
            >
              Chọn trên bản đồ
            </button>
          </div>

          {/* Map display */}
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
            <Suspense
              fallback={
                <div className="flex h-[350px] w-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2F9E44]" />
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

          {/* Coordinates display card */}
          {gpsLat !== undefined && gpsLng !== undefined && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-[#E6F4EA] bg-[#E6F4EA]/30 p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2F9E44] text-white">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-[600] text-[#1B1B1B]">
                    Đã ghim vị trí ruộng
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#5C5C5C]">
                    <span>
                      Tọa độ:{" "}
                      <span className="font-mono text-[#1B1B1B]">
                        {gpsLat.toFixed(6)}, {gpsLng.toFixed(6)}
                      </span>
                    </span>
                    <span>
                      Khu vực:{" "}
                      <span className="font-semibold text-[#1B1B1B]">
                        {geocoding ? "Đang xác định..." : province}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons flow */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <button
            onClick={handleSkip}
            className="text-[14px] font-[600] text-gray-400 transition-colors hover:text-gray-600"
          >
            Bỏ qua bước này
          </button>
          <button
            onClick={handleSaveLocation}
            disabled={gpsLat === undefined || isUpdating || geocoding}
            className="flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#2F9E44] px-6 text-[14px] font-[600] text-white transition-all hover:bg-[#1F6F2E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Lưu & Tiếp tục
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </main>
  );
}
