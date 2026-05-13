"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Leaf, Upload, Brain, FileText, Shield, ChevronDown, Star, Zap, BarChart3, Microscope, Clock, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const heroBg = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

const features = [
  { icon: Brain, title: "AI Chẩn đoán", desc: "Mô hình deep learning nhận diện 10+ bệnh lúa phổ biến với độ chính xác >94%" },
  { icon: Zap, title: "Kết quả tức thì", desc: "Nhận kết quả chẩn đoán và phác đồ điều trị trong vòng 5 giây" },
  { icon: FileText, title: "Phác đồ chi tiết", desc: "Hướng dẫn điều trị toàn diện: hóa học, sinh học, và canh tác" },
  { icon: Shield, title: "Dữ liệu an toàn", desc: "Mã hóa end-to-end, không chia sẻ dữ liệu với bên thứ ba" },
  { icon: BarChart3, title: "Theo dõi lịch sử", desc: "Lưu trữ toàn bộ lịch sử chẩn đoán, so sánh qua các vụ mùa" },
  { icon: Microscope, title: "RAG Knowledge", desc: "Tích hợp cơ sở tri thức nông nghiệp từ IRRI, FAO và chuyên gia Việt Nam" },
];

const steps = [
  { step: "01", title: "Chụp ảnh", desc: "Chụp ảnh lá lúa rõ nét, đủ ánh sáng", icon: Upload },
  { step: "02", title: "AI phân tích", desc: "Hệ thống AI phân tích ảnh trong vài giây", icon: Brain },
  { step: "03", title: "Nhận kết quả", desc: "Xem chi tiết bệnh, mức độ và phác đồ điều trị", icon: FileText },
  { step: "04", title: "Theo dõi", desc: "Lưu lịch sử, theo dõi tiến trình điều trị", icon: Clock },
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
  { name: "Nguyễn Văn Tùng", role: "Nông dân, An Giang", text: "Ứng dụng giúp tôi phát hiện bệnh đạo ôn sớm, cứu được 2 hecta lúa. Rất hữu ích!", rating: 5 },
  { name: "Trần Thị Lan", role: "Nông dân, Đồng Tháp", text: "Giao diện dễ dùng, chỉ cần chụp ảnh là có kết quả. Phác đồ điều trị rất chi tiết.", rating: 5 },
  { name: "Lê Hoàng Minh", role: "Kỹ sư nông nghiệp, Cần Thơ", text: "Công nghệ AI rất chính xác. Tôi khuyên mọi nông dân nên sử dụng hệ thống này.", rating: 4 },
];

const faqs = [
  { q: "Lúa Khoẻ hoạt động như thế nào?", a: "Bạn chỉ cần chụp ảnh lá lúa và tải lên. AI sẽ phân tích, nhận diện bệnh và đưa ra phác đồ điều trị chi tiết trong vài giây." },
  { q: "Độ chính xác của AI là bao nhiêu?", a: "Mô hình AI đạt độ chính xác trung bình 94.2% trên 10+ bệnh lúa phổ biến tại Việt Nam." },
  { q: "Có cần kết nối internet không?", a: "Có, bạn cần internet để tải ảnh và nhận kết quả. Kết quả đã lưu có thể xem offline." },
  { q: "Ứng dụng có miễn phí không?", a: "Hoàn toàn miễn phí cho nông dân. Sứ mệnh hỗ trợ nông nghiệp Việt Nam phát triển bền vững." },
  { q: "Dữ liệu có được bảo mật không?", a: "Tuyệt đối. Dữ liệu được mã hóa và chỉ bạn mới có quyền truy cập." },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return <div ref={ref} className={`${className} transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>{children}</div>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E0E0E0]/50">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-7 h-7 text-[#2F9E44]" />
            <span className="text-[20px] font-[700] text-[#1B1B1B]">Lúa Khoẻ</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[14px] text-[#5C5C5C] hover:text-[#2F9E44]">Tính năng</a>
            <a href="#how-it-works" className="text-[14px] text-[#5C5C5C] hover:text-[#2F9E44]">Cách hoạt động</a>
            <a href="#faq" className="text-[14px] text-[#5C5C5C] hover:text-[#2F9E44]">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href={ROUTES.LOGIN} className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-[14px] text-[#1B1B1B] hover:bg-[#F0F2F5] flex items-center">Đăng nhập</Link>
            <Link href={ROUTES.REGISTER} className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] hover:bg-[#1F6F2E] flex items-center">Đăng ký</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-[72px]">
        <div className="absolute inset-0">
          <ImageWithFallback src={heroBg} alt="Rice field" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6">
              <span className="w-2 h-2 bg-[#2F9E44] rounded-full animate-pulse" />
              <span className="text-[13px] text-white/90">AI chẩn đoán bệnh lúa #1 Việt Nam</span>
            </div>
            <h1 className="text-[48px] md:text-[56px] font-[800] text-white leading-[1.1] mb-6">
              Bảo vệ mùa màng<br /><span className="text-[#4ADE80]">bằng trí tuệ nhân tạo</span>
            </h1>
            <p className="text-[18px] text-white/80 leading-[1.6] mb-8 max-w-[500px]">
              Chẩn đoán chính xác 10+ bệnh lúa phổ biến chỉ với một bức ảnh. Nhận phác đồ điều trị chi tiết trong vài giây.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={ROUTES.REGISTER} className="h-14 px-8 rounded-xl bg-[#2F9E44] text-white text-[16px] font-[600] hover:bg-[#1F6F2E] transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-[#2F9E44]/30">Bắt đầu miễn phí</Link>
              <a href="#how-it-works" className="h-14 px-8 rounded-xl bg-white/10 backdrop-blur-sm text-white text-[16px] font-[500] border border-white/20 hover:bg-white/20 flex items-center gap-2">Tìm hiểu thêm <ChevronDown className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ v: "2,847+", l: "Nông dân sử dụng" }, { v: "15,231", l: "Ảnh đã phân tích" }, { v: "94.2%", l: "Độ chính xác AI" }, { v: "< 5s", l: "Thời gian chẩn đoán" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-[28px] font-[700] text-white">{s.v}</p>
                <p className="text-[13px] text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-[#F7F7F7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal className="text-center mb-14">
            <h2 className="text-[36px] font-[700] text-[#1B1B1B] mb-4">Tính năng nổi bật</h2>
            <p className="text-[16px] text-[#5C5C5C] max-w-[600px] mx-auto">Công nghệ AI tiên tiến kết hợp cơ sở tri thức nông nghiệp chuyên sâu</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => { const Icon = f.icon; return (
              <Reveal key={i}><div className="bg-white rounded-xl border border-[#E0E0E0] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-[#2F9E44]" /></div>
                <h3 className="text-[18px] font-[600] text-[#1B1B1B] mb-2">{f.title}</h3>
                <p className="text-[14px] text-[#5C5C5C] leading-[1.6]">{f.desc}</p>
              </div></Reveal>
            ); })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal className="text-center mb-14">
            <h2 className="text-[36px] font-[700] text-[#1B1B1B] mb-4">Cách hoạt động</h2>
            <p className="text-[16px] text-[#5C5C5C]">Chỉ 4 bước đơn giản để bảo vệ mùa màng</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => { const Icon = s.icon; return (
              <Reveal key={i}><div className="text-center">
                <div className="relative w-20 h-20 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[#2F9E44]" />
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#2F9E44] text-white text-[12px] font-[700] flex items-center justify-center">{s.step}</span>
                </div>
                <h3 className="text-[18px] font-[600] text-[#1B1B1B] mb-2">{s.title}</h3>
                <p className="text-[14px] text-[#5C5C5C] leading-[1.6]">{s.desc}</p>
              </div></Reveal>
            ); })}
          </div>
        </div>
      </section>

      {/* DISEASES */}
      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal className="text-center mb-14">
            <h2 className="text-[36px] font-[700] text-[#1B1B1B] mb-4">Bệnh lúa phổ biến</h2>
            <p className="text-[16px] text-[#5C5C5C]">Hệ thống nhận diện chính xác các bệnh phổ biến nhất</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {diseases.map(d => (
              <Reveal key={d.name}><div className="bg-white rounded-xl border border-[#E0E0E0] p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: d.color + "1A" }}>
                  <span className="text-[14px] font-[700]" style={{ color: d.color }}>{d.percent}</span>
                </div>
                <p className="text-[13px] font-[500] text-[#1B1B1B]">{d.name}</p>
              </div></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal className="text-center mb-14"><h2 className="text-[36px] font-[700] text-[#1B1B1B] mb-4">Nông dân nói gì?</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i}><div className="bg-[#F7F7F7] rounded-xl p-6 h-full">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, si) => <Star key={si} className={`w-4 h-4 ${si < t.rating ? "fill-[#FB8C00] text-[#FB8C00]" : "text-[#E0E0E0]"}`} />)}
                </div>
                <p className="text-[14px] text-[#1B1B1B] leading-[1.6] mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6F4EA] flex items-center justify-center"><Users className="w-5 h-5 text-[#2F9E44]" /></div>
                  <div><p className="text-[14px] font-[600] text-[#1B1B1B]">{t.name}</p><p className="text-[12px] text-[#5C5C5C]">{t.role}</p></div>
                </div>
              </div></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-[#F7F7F7]">
        <div className="max-w-[800px] mx-auto px-6">
          <Reveal className="text-center mb-14"><h2 className="text-[36px] font-[700] text-[#1B1B1B] mb-4">Câu hỏi thường gặp</h2></Reveal>
          <Reveal>
            <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-b border-[#E0E0E0] last:border-0">
                    <AccordionTrigger className="px-6 py-5 hover:bg-[#F7F7F7] text-[15px] font-[600] text-[#1B1B1B] text-left">{f.q}</AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 pt-0 text-[14px] text-[#5C5C5C] leading-[1.6]">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#2F9E44]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-[36px] font-[700] text-white mb-4">Sẵn sàng bảo vệ mùa màng?</h2>
          <p className="text-[16px] text-white/80 mb-8">Đăng ký miễn phí và bắt đầu chẩn đoán bệnh lúa ngay hôm nay</p>
          <Link href={ROUTES.REGISTER} className="inline-flex h-14 px-10 rounded-xl bg-white text-[#2F9E44] text-[16px] font-[600] hover:bg-[#F7F7F7] items-center shadow-lg">Đăng ký miễn phí</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1B1B1B] py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2"><Leaf className="w-6 h-6 text-[#2F9E44]" /><span className="text-[18px] font-[600] text-white">Lúa Khoẻ</span></div>
          <p className="text-[13px] text-[#757575]">© 2026 Lúa Khoẻ — AI chẩn đoán bệnh lúa. Made with ❤️ for Vietnamese farmers.</p>
        </div>
      </footer>
    </div>
  );
}
