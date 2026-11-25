"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

const HERO_BG =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

const STATS = [
  { v: "2,847+", l: "Nông dân tin dùng" },
  { v: "15,231", l: "Mẫu ảnh đã quét" },
  { v: "94.2%", l: "Độ chính xác AI" },
  { v: "< 5s", l: "Thời gian trả kết quả" },
];

const emptySubscribe = () => () => {};

export function LandingHero() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { user } = useAuth();
  const primaryHref = mounted && user ? ROUTES.DIAGNOSE : ROUTES.REGISTER;

  return (
    <section className="relative flex min-h-[680px] items-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:min-h-[760px]">
      {/* Background Photograph + Directional Forest Scrim */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={HERO_BG}
          alt="Cánh đồng lúa xanh Việt Nam"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09120c]/92 via-[#0c1a11]/75 to-[#09120c]/45" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#09120c]/85 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Copy Column */}
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide text-white/95 sm:text-[13px]">
              Trợ lý AI bảo vệ lúa Việt Nam
            </span>
          </div>

          <h1 className="font-heading mb-5 text-3xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-5xl lg:text-[54px]">
            Chẩn đoán bệnh lúa
            <br />
            <span className="text-emerald-400">chính xác trong vài giây</span>
          </h1>

          <p className="mb-8 max-w-[540px] text-base leading-relaxed text-white/80 sm:text-lg">
            Chụp ảnh lá lúa trực tiếp ngoài đồng để AI nhận diện 10+ loại bệnh
            phổ biến, đo mức độ nhiễm và đề xuất phác đồ điều trị chuẩn chuyên
            gia.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href={primaryHref}
              className="bg-primary hover:bg-primary-hover flex h-13 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold text-white shadow-lg shadow-black/25 transition-all hover:scale-[1.02] sm:h-14 sm:px-8"
            >
              <span>Bắt đầu chẩn đoán miễn phí</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="flex h-13 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/12 px-7 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/22 sm:h-14 sm:px-7"
            >
              <span>Xem cách hoạt động</span>
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>

          {/* Inline Trust Telemetry Row */}
          <div className="mt-9 grid grid-cols-2 gap-4 border-t border-white/15 pt-6 sm:grid-cols-4 sm:gap-6">
            {STATS.map((stat) => (
              <div key={stat.l}>
                <p className="font-heading text-2xl font-bold text-white tabular-nums sm:text-[26px]">
                  {stat.v}
                </p>
                <p className="mt-0.5 text-xs text-white/70 sm:text-[13px]">
                  {stat.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Clinical Preview Card */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-white/15 bg-[#0e1912]/82 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="bg-primary/25 flex h-9 w-9 items-center justify-center rounded-xl text-emerald-400">
                  <ScanSearch className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white/65">
                    Kết quả phân tích mẫu
                  </p>
                  <p className="text-sm font-bold text-white">
                    Ruộng mẫu · Đồng Tháp
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300 tabular-nums">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                1.8s
              </span>
            </div>

            {/* Detection Summary */}
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-heading text-lg font-bold text-white">
                  Bệnh đạo ôn lá
                </span>
                <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                  Cần xử lý sớm
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="mb-1 flex justify-between text-white/75">
                    <span>Độ tin cậy AI</span>
                    <span className="font-bold text-emerald-300 tabular-nums">
                      96.4%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[96%] rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-white/75">
                    <span>Diện tích nhiễm ước tính</span>
                    <span className="font-bold text-amber-300 tabular-nums">
                      22.5%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[22.5%] rounded-full bg-amber-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Protocol Snippet */}
            <div className="space-y-2.5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {["Hóa học", "Sinh học", "Canh tác"].map((layer) => (
                  <span
                    key={layer}
                    className="rounded-md bg-white/12 px-2 py-0.5 text-[11px] font-semibold text-white/90"
                  >
                    {layer}
                  </span>
                ))}
              </div>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-white/85">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  Phun phòng sớm bằng hoạt chất đặc trị lúc sáng sớm, giữ mực
                  nước ổn định 3–5 cm và tạm ngưng bón thừa đạm.
                </span>
              </p>
            </div>

            <div className="mt-4 flex items-center text-[11px] text-white/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Tri thức IRRI · FAO · Khuyến nông VN
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
