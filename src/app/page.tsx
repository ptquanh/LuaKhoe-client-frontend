"use client";

import { Button, Typography } from "antd";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";

import HomeDiseases from "./_components/HomeDiseases";
import HomeFAQ from "./_components/HomeFAQ";
import HomeFeatures from "./_components/HomeFeatures";
import HomeTestimonials from "./_components/HomeTestimonials";

const { Title, Paragraph } = Typography;

const STATS = [
  { value: "50,000+", label: "Nông dân sử dụng" },
  { value: "200,000+", label: "Lượt chẩn đoán" },
  { value: "95.2%", label: "Độ chính xác AI" },
  { value: "63", label: "Tỉnh thành phủ sóng" },
];

const STEPS = [
  {
    step: "BƯỚC 1",
    icon: "📸",
    title: "Chụp / Upload ảnh",
    desc: "Chụp ảnh lá lúa bằng camera điện thoại hoặc tải ảnh từ thiết bị. Hỗ trợ nhiều định dạng ảnh phổ biến.",
  },
  {
    step: "BƯỚC 2",
    icon: "🤖",
    title: "AI phân tích",
    desc: "Mô hình Deep Learning phân tích hình ảnh, nhận diện bệnh và đánh giá mức độ nghiêm trọng chỉ trong vài giây.",
  },
  {
    step: "BƯỚC 3",
    icon: "👨‍🔬",
    title: "Chuyên gia kiểm duyệt",
    desc: "Kết quả được gửi đến đội ngũ chuyên gia bệnh học lúa để xác nhận, đảm bảo độ tin cậy cao nhất.",
  },
  {
    step: "BƯỚC 4",
    icon: "💊",
    title: "Nhận phác đồ điều trị",
    desc: "Nhận hướng dẫn chi tiết về cách điều trị, liều lượng thuốc, thời điểm phun và gợi ý vật tư nông nghiệp.",
  },
];

const PARTNERS = [
  "Bộ NN&PTNT",
  "Đại học Cần Thơ",
  "IRRI Vietnam",
  "VTV Cần Thơ",
  "Báo Nông nghiệp",
  "Syngenta",
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/90 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-lg font-bold text-green-800">Lúa Khoẻ</span>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => router.push(ROUTES.LOGIN)}>Đăng nhập</Button>
            <Button
              type="primary"
              style={{ backgroundColor: "#166534", borderColor: "#166534" }}
              onClick={() => router.push(ROUTES.REGISTER)}
            >
              Đăng ký
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative flex min-h-screen items-center pt-20"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600') center/cover no-repeat",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium tracking-widest text-green-300 uppercase">
              🌾 Nền tảng #1 chẩn đoán bệnh lúa tại Việt Nam
            </p>
            <Title
              level={1}
              className="!mb-4 !text-4xl !leading-tight !text-white"
            >
              Lúa Khoẻ — Nông nghiệp Lúa Số
            </Title>
            <Paragraph className="mb-8 text-lg leading-relaxed !text-gray-200">
              Ứng dụng AI chẩn đoán bệnh trên cây lúa nhanh chóng, chính xác.
              Giúp nông dân bảo vệ mùa màng hiệu quả hơn mỗi ngày.
            </Paragraph>
            <div className="flex flex-wrap gap-3">
              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: "#166534",
                  borderColor: "#166534",
                  height: 48,
                  paddingInline: 28,
                  fontSize: 16,
                }}
                onClick={() => router.push(ROUTES.DIAGNOSE)}
              >
                Dùng thử chẩn đoán AI
              </Button>
              <Button
                size="large"
                style={{
                  height: 48,
                  paddingInline: 28,
                  fontSize: 16,
                  color: "white",
                  borderColor: "white",
                  background: "transparent",
                }}
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-center backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-green-300">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÁCH HOẠT ĐỘNG */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <Title level={2} className="!mb-2 !text-gray-800">
              Cách Hoạt Động
            </Title>
            <p className="text-gray-400">
              Quy trình 4 bước đơn giản — từ chụp ảnh đến nhận phác đồ điều trị
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-2xl border border-gray-100 p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="mb-4 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                  {s.step}
                </span>
                <div className="mb-3 text-4xl">{s.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-800">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeFeatures />
      <HomeDiseases />
      <HomeTestimonials />

      {/* ĐỐI TÁC */}
      <section className="border-y border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-6 text-sm tracking-widest text-gray-400 uppercase">
            Đối tác & Báo chí
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {PARTNERS.map((p) => (
              <div
                key={p}
                className="rounded-lg border border-gray-100 bg-gray-50 px-5 py-2 text-sm font-medium text-gray-500"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeFAQ />

      {/* CTA */}
      <section className="bg-green-800 py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <Title level={2} className="!mb-3 !text-white">
            Bảo vệ mùa màng ngay hôm nay
          </Title>
          <p className="mb-8 text-green-200">
            Tham gia cùng hơn 50,000 nông dân đang sử dụng Lúa Khoẻ để chẩn đoán
            bệnh lúa chính xác và nhanh chóng.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="large"
              style={{
                height: 48,
                paddingInline: 28,
                fontSize: 16,
                backgroundColor: "white",
                color: "#166534",
                borderColor: "white",
              }}
              onClick={() => router.push(ROUTES.REGISTER)}
            >
              Đăng ký miễn phí
            </Button>
            <Button
              size="large"
              style={{
                height: 48,
                paddingInline: 28,
                fontSize: 16,
                color: "white",
                borderColor: "white",
                background: "transparent",
              }}
              onClick={() => router.push(ROUTES.DIAGNOSE)}
            >
              Dùng thử ngay
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-14 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span className="text-lg font-bold">Lúa Khoẻ</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Nền tảng chẩn đoán bệnh lúa bằng AI, hỗ trợ nông dân Việt Nam bảo
              vệ mùa màng hiệu quả.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Sản phẩm</p>
            {["Chẩn đoán AI", "Lịch sử", "Vật tư"].map((i) => (
              <p
                key={i}
                className="mb-2 cursor-pointer text-sm text-gray-400 hover:text-white"
              >
                {i}
              </p>
            ))}
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Hỗ trợ</p>
            {["Liên hệ", "Điều khoản", "Chính sách"].map((i) => (
              <p
                key={i}
                className="mb-2 cursor-pointer text-sm text-gray-400 hover:text-white"
              >
                {i}
              </p>
            ))}
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Cộng đồng</p>
            {["Facebook", "Zalo OA", "YouTube"].map((i) => (
              <p
                key={i}
                className="mb-2 cursor-pointer text-sm text-gray-400 hover:text-white"
              >
                {i}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-10 text-center text-xs text-gray-600">
          © 2026 Lúa Khoẻ. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
