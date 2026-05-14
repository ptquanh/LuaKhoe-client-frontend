"use client";

import {
  BarChart3,
  Brain,
  ChevronDown,
  Clock,
  FileText,
  Leaf,
  Microscope,
  Shield,
  Star,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ROUTES } from "@/constants/routes";

const heroBg =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

const features = [
  {
    icon: Brain,
    title: "AI Chẩn đoán",
    desc: "Mô hình deep learning nhận diện 10+ bệnh lúa phổ biến với độ chính xác >94%",
  },
  {
    icon: Zap,
    title: "Kết quả tức thì",
    desc: "Nhận kết quả chẩn đoán và phác đồ điều trị trong vòng 5 giây",
  },
  {
    icon: FileText,
    title: "Phác đồ chi tiết",
    desc: "Hướng dẫn điều trị toàn diện: hóa học, sinh học, và canh tác",
  },
  {
    icon: Shield,
    title: "Dữ liệu an toàn",
    desc: "Mã hóa end-to-end, không chia sẻ dữ liệu với bên thứ ba",
  },
  {
    icon: BarChart3,
    title: "Theo dõi lịch sử",
    desc: "Lưu trữ toàn bộ lịch sử chẩn đoán, so sánh qua các vụ mùa",
  },
  {
    icon: Microscope,
    title: "RAG Knowledge",
    desc: "Tích hợp cơ sở tri thức nông nghiệp từ IRRI, FAO và chuyên gia Việt Nam",
  },
];

const steps = [
  {
    step: "01",
    title: "Chụp ảnh",
    desc: "Chụp ảnh lá lúa rõ nét, đủ ánh sáng",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI phân tích",
    desc: "Hệ thống AI phân tích ảnh trong vài giây",
    icon: Brain,
  },
  {
    step: "03",
    title: "Nhận kết quả",
    desc: "Xem chi tiết bệnh, mức độ và phác đồ điều trị",
    icon: FileText,
  },
  {
    step: "04",
    title: "Theo dõi",
    desc: "Lưu lịch sử, theo dõi tiến trình điều trị",
    icon: Clock,
  },
];

const diseases = [
  { name: "Bệnh đạo ôn", percent: "32%", color: "#2F9E44" },
  { name: "Bệnh bạc lá", percent: "25%", color: "#1976D2" },
  { name: "Bệnh khô vằn", percent: "18%", color: "#FB8C00" },
  { name: "Bệnh đốm nâu", percent: "12%", color: "#E53935" },
  { name: "Bệnh vàng lùn", percent: "8%", color: "#7B1FA2" },
  { name: "Lùn xoắn lá", percent: "5%", color: "#00838F" },
];

const testimonials = [
  {
    name: "Nguyễn Văn Tùng",
    role: "Nông dân, An Giang",
    text: "Ứng dụng giúp tôi phát hiện bệnh đạo ôn sớm, cứu được 2 hecta lúa. Rất hữu ích!",
    rating: 5,
  },
  {
    name: "Trần Thị Lan",
    role: "Nông dân, Đồng Tháp",
    text: "Giao diện dễ dùng, chỉ cần chụp ảnh là có kết quả. Phác đồ điều trị rất chi tiết.",
    rating: 5,
  },
  {
    name: "Lê Hoàng Minh",
    role: "Kỹ sư nông nghiệp, Cần Thơ",
    text: "Công nghệ AI rất chính xác. Tôi khuyên mọi nông dân nên sử dụng hệ thống này.",
    rating: 4,
  },
];

const faqs = [
  {
    q: "Lúa Khoẻ hoạt động như thế nào?",
    a: "Bạn chỉ cần chụp ảnh lá lúa và tải lên. AI sẽ phân tích, nhận diện bệnh và đưa ra phác đồ điều trị chi tiết trong vài giây.",
  },
  {
    q: "Độ chính xác của AI là bao nhiêu?",
    a: "Mô hình AI đạt độ chính xác trung bình 94.2% trên 10+ bệnh lúa phổ biến tại Việt Nam.",
  },
  {
    q: "Có cần kết nối internet không?",
    a: "Có, bạn cần internet để tải ảnh và nhận kết quả. Kết quả đã lưu có thể xem offline.",
  },
  {
    q: "Ứng dụng có miễn phí không?",
    a: "Hoàn toàn miễn phí cho nông dân. Sứ mệnh hỗ trợ nông nghiệp Việt Nam phát triển bền vững.",
  },
  {
    q: "Dữ liệu có được bảo mật không?",
    a: "Tuyệt đối. Dữ liệu được mã hóa và chỉ bạn mới có quyền truy cập.",
  },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif]">
      {/* NAV */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[#E0E0E0]/50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-[#2F9E44]" />
            <span className="text-[20px] font-[700] text-[#1B1B1B]">
              Lúa Khoẻ
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-[14px] text-[#5C5C5C] hover:text-[#2F9E44]"
            >
              Tính năng
            </a>
            <a
              href="#how-it-works"
              className="text-[14px] text-[#5C5C5C] hover:text-[#2F9E44]"
            >
              Cách hoạt động
            </a>
            <a
              href="#faq"
              className="text-[14px] text-[#5C5C5C] hover:text-[#2F9E44]"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="flex h-10 items-center rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#1B1B1B] hover:bg-[#F0F2F5]"
            >
              Đăng nhập
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="flex h-10 items-center rounded-lg bg-[#2F9E44] px-4 text-[14px] text-white hover:bg-[#1F6F2E]"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center pt-[72px]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroBg}
            alt="Rice field"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-20">
          <div className="max-w-[640px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2F9E44]" />
              <span className="text-[13px] text-white/90">
                AI chẩn đoán bệnh lúa #1 Việt Nam
              </span>
            </div>
            <h1 className="mb-6 text-[48px] leading-[1.1] font-[800] text-white md:text-[56px]">
              Bảo vệ mùa màng
              <br />
              <span className="text-[#4ADE80]">bằng trí tuệ nhân tạo</span>
            </h1>
            <p className="mb-8 max-w-[500px] text-[18px] leading-[1.6] text-white/80">
              Chẩn đoán chính xác 10+ bệnh lúa phổ biến chỉ với một bức ảnh.
              Nhận phác đồ điều trị chi tiết trong vài giây.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={ROUTES.REGISTER}
                className="flex h-14 items-center gap-2 rounded-xl bg-[#2F9E44] px-8 text-[16px] font-[600] text-white shadow-lg shadow-[#2F9E44]/30 transition-all hover:scale-105 hover:bg-[#1F6F2E]"
              >
                Bắt đầu miễn phí
              </Link>
              <a
                href="#how-it-works"
                className="flex h-14 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 text-[16px] font-[500] text-white backdrop-blur-sm hover:bg-white/20"
              >
                Tìm hiểu thêm <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 left-0 border-t border-white/10 bg-white/10 backdrop-blur-md">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-6 py-5 md:grid-cols-4">
            {[
              { v: "2,847+", l: "Nông dân sử dụng" },
              { v: "15,231", l: "Ảnh đã phân tích" },
              { v: "94.2%", l: "Độ chính xác AI" },
              { v: "< 5s", l: "Thời gian chẩn đoán" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-[28px] font-[700] text-white">{s.v}</p>
                <p className="text-[13px] text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#F7F7F7] py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-[36px] font-[700] text-[#1B1B1B]">
              Tính năng nổi bật
            </h2>
            <p className="mx-auto max-w-[600px] text-[16px] text-[#5C5C5C]">
              Công nghệ AI tiên tiến kết hợp cơ sở tri thức nông nghiệp chuyên
              sâu
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i}>
                  <div className="h-full rounded-xl border border-[#E0E0E0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F4EA]">
                      <Icon className="h-6 w-6 text-[#2F9E44]" />
                    </div>
                    <h3 className="mb-2 text-[18px] font-[600] text-[#1B1B1B]">
                      {f.title}
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-[#5C5C5C]">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-[36px] font-[700] text-[#1B1B1B]">
              Cách hoạt động
            </h2>
            <p className="text-[16px] text-[#5C5C5C]">
              Chỉ 4 bước đơn giản để bảo vệ mùa màng
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={i}>
                  <div className="text-center">
                    <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E6F4EA]">
                      <Icon className="h-8 w-8 text-[#2F9E44]" />
                      <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#2F9E44] text-[12px] font-[700] text-white">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="mb-2 text-[18px] font-[600] text-[#1B1B1B]">
                      {s.title}
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-[#5C5C5C]">
                      {s.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DISEASES */}
      <section className="bg-[#F7F7F7] py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-[36px] font-[700] text-[#1B1B1B]">
              Bệnh lúa phổ biến
            </h2>
            <p className="text-[16px] text-[#5C5C5C]">
              Hệ thống nhận diện chính xác các bệnh phổ biến nhất
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {diseases.map((d) => (
              <Reveal key={d.name}>
                <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 text-center transition-shadow hover:shadow-md">
                  <div
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: d.color + "1A" }}
                  >
                    <span
                      className="text-[14px] font-[700]"
                      style={{ color: d.color }}
                    >
                      {d.percent}
                    </span>
                  </div>
                  <p className="text-[13px] font-[500] text-[#1B1B1B]">
                    {d.name}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-[36px] font-[700] text-[#1B1B1B]">
              Nông dân nói gì?
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i}>
                <div className="h-full rounded-xl bg-[#F7F7F7] p-6">
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, si) => (
                      <Star
                        key={si}
                        className={`h-4 w-4 ${si < t.rating ? "fill-[#FB8C00] text-[#FB8C00]" : "text-[#E0E0E0]"}`}
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-[14px] leading-[1.6] text-[#1B1B1B]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F4EA]">
                      <Users className="h-5 w-5 text-[#2F9E44]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-[600] text-[#1B1B1B]">
                        {t.name}
                      </p>
                      <p className="text-[12px] text-[#5C5C5C]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#F7F7F7] py-20">
        <div className="mx-auto max-w-[800px] px-6">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-[36px] font-[700] text-[#1B1B1B]">
              Câu hỏi thường gặp
            </h2>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border-b border-[#E0E0E0] last:border-0"
                  >
                    <AccordionTrigger className="px-6 py-5 text-left text-[15px] font-[600] text-[#1B1B1B] hover:bg-[#F7F7F7]">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-0 pb-5 text-[14px] leading-[1.6] text-[#5C5C5C]">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2F9E44] py-20">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <h2 className="mb-4 text-[36px] font-[700] text-white">
            Sẵn sàng bảo vệ mùa màng?
          </h2>
          <p className="mb-8 text-[16px] text-white/80">
            Đăng ký miễn phí và bắt đầu chẩn đoán bệnh lúa ngay hôm nay
          </p>
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex h-14 items-center rounded-xl bg-white px-10 text-[16px] font-[600] text-[#2F9E44] shadow-lg hover:bg-[#F7F7F7]"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1B1B1B] py-12">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[#2F9E44]" />
            <span className="text-[18px] font-[600] text-white">Lúa Khoẻ</span>
          </div>
          <p className="text-[13px] text-[#757575]">
            © 2026 Lúa Khoẻ — AI chẩn đoán bệnh lúa. Made with ❤️ for Vietnamese
            farmers.
          </p>
        </div>
      </footer>
    </div>
  );
}
