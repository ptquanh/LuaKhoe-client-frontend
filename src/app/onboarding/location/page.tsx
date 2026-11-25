"use client";

import { message } from "antd";
import { ArrowRight, Check, Compass, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { lazy, Suspense, useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserFields } from "@/hooks/useUserFields";

const LazyMapComponent = lazy(
  () => import("../../(private)/diagnose/components/MapComponent"),
);

export default function OnboardingLocationPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { refetch } = useProfile();
  const { createField, isCreating } = useUserFields();

  const [gpsLat, setGpsLat] = useState<number | undefined>(undefined);
  const [gpsLng, setGpsLng] = useState<number | undefined>(undefined);
  const [province, setProvince] = useState<string>("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [isGoogleFlow] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("completed_password_step") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push(ROUTES.LOGIN);
      } else if (!user.hasPassword) {
        router.push("/onboarding/password");
      }
    }
  }, [user, isAuthLoading, router]);

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

    await createField(
      {
        fieldName: "Thửa ruộng mặc định",
        gpsLat,
        gpsLng,
        address: province,
        isDefault: true,
      },
      async () => {
        message.success("Lưu vị trí ruộng mặc định thành công!");
        if (user) {
          localStorage.setItem(`onboarding_skipped_${user.id}`, "true");
        }
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("completed_password_step");
        }
        await refetch();
        router.push(ROUTES.DIAGNOSE);
      },
    );
  };

  const handleSkip = () => {
    if (user) {
      localStorage.setItem(`onboarding_skipped_${user.id}`, "true");
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("completed_password_step");
    }
    router.push(ROUTES.DIAGNOSE);
  };

  if (isAuthLoading || !user || !user.hasPassword) {
    return (
      <div className="bg-bg-page flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
          <p className="text-text-secondary mt-2 text-sm">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-bg-page relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="border-border bg-bg-card w-full max-w-[620px] rounded-2xl border p-5 shadow-md transition-all sm:p-8">
        {/* Progress header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <BrandLogo size="sm" subtitle="Onboarding" />
          <div className="flex items-center gap-2">
            <span className="bg-primary-light text-primary rounded-full px-3 py-1 text-xs font-semibold tabular-nums">
              {isGoogleFlow ? "Bước 2 / 2" : "Bước 1 / 1"}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="font-heading text-text-primary text-2xl font-bold tracking-tight">
            Thiết lập vị trí ruộng mặc định
          </h2>
          <p className="text-text-secondary mt-1.5 text-sm leading-relaxed">
            Chọn vị trí ruộng lúa của bạn để hệ thống tự động tải dữ liệu thời
            tiết, dự báo dịch bệnh nông nghiệp chính xác nhất mà không cần định
            vị mỗi lần quét.
          </p>
        </div>

        {/* Location setup block */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="border-primary bg-bg-card text-primary hover:bg-primary-light/50 flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all disabled:opacity-50"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Compass className="h-4 w-4" />
              )}
              Lấy vị trí hiện tại
            </button>
            <button
              type="button"
              onClick={() => {
                setGpsLat(10.3759);
                setGpsLng(105.4246);
              }}
              className="border-border bg-bg-card text-text-secondary hover:bg-bg-hover flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-medium transition-all"
            >
              Chọn trên bản đồ
            </button>
          </div>

          <div className="border-border bg-bg-subtle relative overflow-hidden rounded-xl border shadow-inner">
            <Suspense
              fallback={
                <div className="flex h-[320px] w-full items-center justify-center sm:h-[350px]">
                  <Loader2 className="text-primary h-8 w-8 animate-spin" />
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
            <div className="animate-in fade-in slide-in-from-top-2 border-primary-border bg-primary-light/60 rounded-xl border p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="bg-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading text-text-primary text-sm font-semibold">
                    Đã ghim vị trí ruộng
                  </h4>
                  <div className="text-text-secondary mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span>
                      Tọa độ:{" "}
                      <span className="text-text-primary font-mono tabular-nums">
                        {gpsLat.toFixed(6)}, {gpsLng.toFixed(6)}
                      </span>
                    </span>
                    <span>
                      Khu vực:{" "}
                      <span className="text-text-primary font-semibold">
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
        <div className="border-border flex items-center justify-between gap-3 border-t pt-5">
          <button
            type="button"
            onClick={handleSkip}
            className="text-text-secondary hover:text-text-primary min-h-11 cursor-pointer px-2 text-sm font-semibold transition-colors"
          >
            Bỏ qua bước này
          </button>
          <button
            type="button"
            onClick={handleSaveLocation}
            disabled={gpsLat === undefined || isCreating || geocoding}
            className="bg-primary hover:bg-primary-hover flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
          >
            {isCreating ? (
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
