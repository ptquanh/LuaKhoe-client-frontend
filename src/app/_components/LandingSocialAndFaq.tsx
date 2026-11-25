"use client";

import { ArrowRight, Heart, MessageSquareText, Star } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ROUTES } from "@/constants/routes";

import { Reveal } from "./Reveal";

const TESTIMONIALS = [
  {
    name: "Nguyễn Văn Tùng",
    initials: "NT",
    role: "Nông dân · An Giang",
    text: "Ứng dụng giúp tôi phát hiện bệnh đạo ôn sớm ngay giai đoạn đẻ nhánh, xử lý kịp thời cho hơn 2 hecta lúa.",
    rating: 5,
  },
  {
    name: "Trần Thị Lan",
    initials: "TL",
    role: "Nông dân · Đồng Tháp",
    text: "Chỉ cần mở điện thoại chụp ảnh lá lúa là có kết quả ngay. Phác đồ tách riêng hóa học và sinh học rất dễ áp dụng.",
    rating: 5,
  },
  {
    name: "Lê Hoàng Minh",
    initials: "LM",
    role: "Kỹ sư nông nghiệp · Cần Thơ",
    text: "AI nhận diện chuẩn và giải thích rõ ràng nguồn tham khảo. Rất phù hợp để bà con đối chiếu nhanh trước khi phun thuốc.",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "Lúa Khoẻ hoạt động như thế nào?",
    a: "Bạn chỉ cần chụp ảnh lá lúa và tải lên. AI sẽ phân tích, nhận diện vùng bệnh và đưa ra phác đồ điều trị chi tiết trong vài giây.",
  },
  {
    q: "Độ chính xác của AI là bao nhiêu?",
    a: "Mô hình AI đạt độ chính xác trung bình 94.2% trên các bệnh lúa phổ biến tại Việt Nam, và hỗ trợ gửi thêm ảnh cận cảnh để chấm điểm lại.",
  },
  {
    q: "Có cần kết nối internet không?",
    a: "Bạn cần internet khi tải ảnh lên để hệ thống phân tích và đồng bộ lịch sử bệnh án theo ruộng lúa của mình.",
  },
  {
    q: "Ứng dụng có miễn phí không?",
    a: "Hoàn toàn miễn phí cho nông dân với sứ mệnh hỗ trợ canh tác lúa bền vững và giảm lạm dụng thuốc bảo vệ thực vật.",
  },
  {
    q: "Dữ liệu ruộng lúa có được bảo mật không?",
    a: "Dữ liệu cá nhân và bệnh án của bạn được bảo vệ an toàn, chỉ bạn mới có quyền xem lịch sử trừ khi bạn chủ động chia sẻ lên diễn đàn.",
  },
];

export function LandingSocialAndFaq() {
  return (
    <>
      {/* TESTIMONIALS */}
      <section className="border-border/60 bg-bg-card border-y py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal className="mb-12 text-center sm:mb-14">
            <span className="border-primary-border bg-primary-soft text-primary mb-3 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
              Phản hồi thực tế
            </span>
            <h2 className="font-heading text-text-primary text-2xl font-extrabold tracking-tight sm:text-[36px]">
              Nhà nông và kỹ sư nói gì?
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Reveal key={t.name}>
                <div className="border-border bg-bg-page flex h-full flex-col justify-between rounded-2xl border p-6 shadow-xs">
                  <div>
                    <div className="mb-4 flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, si) => (
                        <Star
                          key={si}
                          className={`h-4 w-4 ${
                            si < t.rating
                              ? "fill-amber-500 text-amber-500"
                              : "text-border-strong"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-text-primary mb-6 text-sm leading-relaxed sm:text-[15px]">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  <div className="border-border flex items-center gap-3 border-t pt-4">
                    <span className="bg-primary-soft text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold">
                      {t.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-text-primary truncate text-sm font-bold">
                        {t.name}
                      </p>
                      <p className="text-text-secondary truncate text-xs">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-bg-page py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="border-primary-border bg-primary-soft text-primary mb-3 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
              Giải đáp thắc mắc
            </span>
            <h2 className="font-heading text-text-primary mb-3 text-2xl font-extrabold tracking-tight sm:text-[32px]">
              Câu hỏi thường gặp
            </h2>
            <p className="text-text-secondary mb-6 text-sm leading-relaxed sm:text-base">
              Những thông tin cần biết trước khi sử dụng Lúa Khoẻ ngoài đồng
              ruộng.
            </p>
            <div className="border-border bg-bg-card rounded-2xl border p-5 shadow-xs">
              <div className="mb-2 flex items-center gap-2">
                <MessageSquareText className="text-primary h-4.5 w-4.5" />
                <span className="text-text-primary text-sm font-bold">
                  Cần trao đổi thêm?
                </span>
              </div>
              <p className="text-text-secondary mb-3 text-xs leading-relaxed">
                Đặt câu hỏi trực tiếp cùng bà con và kỹ sư nông nghiệp tại diễn
                đàn cộng đồng.
              </p>
              <Link
                href={ROUTES.FORUM}
                className="text-primary inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
              >
                <span>Ghé thăm diễn đàn</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8">
            <div className="border-border bg-bg-card overflow-hidden rounded-2xl border shadow-xs">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`faq-${i}`}
                    className="border-border border-b last:border-0"
                  >
                    <AccordionTrigger className="text-text-primary hover:bg-bg-hover px-5 py-5 text-left text-[15px] font-semibold sm:px-6">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-secondary px-5 pt-0 pb-5 text-sm leading-relaxed sm:px-6">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FRAMED CTA */}
      <section className="bg-bg-page px-4 pb-16 sm:px-6 sm:pb-24">
        <Reveal className="mx-auto max-w-[1200px]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#165c2e] via-[#1f7a3e] to-[#0f3d21] px-6 py-12 text-center text-white shadow-xl sm:px-12 sm:py-16">
            <div className="relative z-10 mx-auto max-w-[660px]">
              <h2 className="font-heading mb-3 text-2xl font-extrabold tracking-tight sm:text-[36px]">
                Sẵn sàng bảo vệ mùa màng ngay hôm nay?
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-white/85 sm:text-base">
                Đăng ký tài khoản miễn phí để lưu nhật ký bệnh án và nhận khuyến
                nghị điều trị chính xác từ AI.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href={ROUTES.REGISTER}
                  className="text-primary inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold shadow-lg transition-colors hover:bg-emerald-50 sm:h-13 sm:px-8 sm:text-base"
                >
                  <span>Đăng ký miễn phí</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={ROUTES.FORUM}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:h-13 sm:text-base"
                >
                  Khám phá diễn đàn
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0d1610] py-12 text-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 md:grid-cols-12">
            <div className="space-y-3 md:col-span-6">
              <BrandLogo size="md" inverted />
              <p className="max-w-[380px] text-sm leading-relaxed text-white/70">
                Nền tảng AI hỗ trợ chẩn đoán sớm bệnh hại trên cây lúa và tư vấn
                phác đồ canh tác bền vững cho nông dân Việt Nam.
              </p>
            </div>

            <div className="space-y-2.5 md:col-span-3">
              <h3 className="text-xs font-bold tracking-wider text-white/60 uppercase">
                Khám phá
              </h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#features" className="hover:text-white">
                    Tính năng nổi bật
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    Quy trình 4 bước
                  </a>
                </li>
                <li>
                  <a href="#diseases" className="hover:text-white">
                    Bệnh lúa phổ biến
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    Câu hỏi thường gặp
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 md:col-span-3">
              <h3 className="text-xs font-bold tracking-wider text-white/60 uppercase">
                Ứng dụng
              </h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link href={ROUTES.DIAGNOSE} className="hover:text-white">
                    Chẩn đoán AI
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.HISTORY} className="hover:text-white">
                    Lịch sử bệnh án
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.FORUM} className="hover:text-white">
                    Diễn đàn nhà nông
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.LOGIN} className="hover:text-white">
                    Đăng nhập
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-white/60 sm:flex-row">
            <p>© 2026 Lúa Khoẻ — AI chẩn đoán bệnh lúa.</p>
            <p className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="text-error inline h-3.5 w-3.5 fill-current" />
              <span>for Vietnamese farmers.</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
