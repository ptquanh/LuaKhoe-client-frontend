"use client";

import {
  BookOpen,
  Brain,
  FileText,
  History,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Reveal } from "./Reveal";

const DETECTION_TAGS = [
  { name: "Đạo ôn", score: "96%" },
  { name: "Bạc lá", score: "94%" },
  { name: "Đốm nâu", score: "91%" },
  { name: "Khô vằn", score: "89%" },
];

const PROTOCOL_LAYERS = ["Hóa học", "Sinh học", "Canh tác", "Cân đối N-P-K"];

export function LandingFeaturesBento() {
  return (
    <section id="features" className="bg-bg-page py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal className="mb-12 text-center sm:mb-14">
          <span className="border-primary-border bg-primary-soft text-primary mb-3 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
            Nền tảng công nghệ
          </span>
          <h2 className="font-heading text-text-primary mb-3 text-2xl font-extrabold tracking-tight sm:text-[36px]">
            Trợ lý nông học toàn diện trên đồng ruộng
          </h2>
          <p className="text-text-secondary mx-auto max-w-[620px] text-sm sm:text-base">
            Kết hợp thị giác máy tính và kho tri thức nông nghiệp để rút ngắn
            thời gian phát hiện và xử lý dịch bệnh
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          {/* Card 1: Featured 7 cols */}
          <Reveal className="lg:col-span-7">
            <div className="border-border bg-bg-card hover:border-primary/40 flex h-full flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md sm:p-7">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="bg-primary-soft text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <Brain className="h-6 w-6" />
                  </div>
                  <span className="border-primary-border bg-primary-soft text-primary rounded-full border px-3 py-1 text-xs font-bold tabular-nums">
                    Độ chính xác &gt; 94%
                  </span>
                </div>
                <h3 className="font-heading text-text-primary mb-2 text-xl font-bold">
                  AI Chẩn đoán đa bệnh trên cùng một mẫu lá
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed sm:text-[15px]">
                  Khoanh vùng tổn thương bằng thị giác máy tính, ước tính tỷ lệ
                  diện tích nhiễm và hỗ trợ gửi ảnh cận cảnh để hiệu chỉnh kết
                  quả khi ruộng xuất hiện đồng thời nhiều triệu chứng.
                </p>
              </div>

              <div className="border-border mt-6 flex flex-wrap gap-2 border-t pt-4">
                {DETECTION_TAGS.map((tag) => (
                  <span
                    key={tag.name}
                    className="border-border bg-bg-subtle text-text-primary inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold"
                  >
                    <span>{tag.name}</span>
                    <span className="text-primary tabular-nums">
                      {tag.score}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Card 2: RAG Knowledge 5 cols */}
          <Reveal className="lg:col-span-5">
            <div className="border-border bg-bg-card hover:border-primary/40 flex h-full flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md sm:p-7">
              <div>
                <div className="bg-info/15 text-info mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-text-primary mb-2 text-xl font-bold">
                  Kho tri thức RAG chuẩn khuyến nông
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed sm:text-[15px]">
                  Tổng hợp tài liệu kỹ thuật từ IRRI, FAO và quy trình canh tác
                  lúa tại Việt Nam để đưa ra khuyến nghị bám sát giai đoạn sinh
                  trưởng.
                </p>
              </div>
              <div className="border-border mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
                {["IRRI Rice Bank", "FAO", "Khuyến nông VN"].map((src) => (
                  <span
                    key={src}
                    className="border-border bg-bg-subtle text-text-secondary rounded-md border px-2.5 py-1 text-xs font-medium"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Card 3: 3-Layer Protocol */}
          <Reveal className="lg:col-span-4">
            <div className="border-border bg-bg-card hover:border-primary/40 flex h-full flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md">
              <div>
                <div className="bg-accent-light text-accent mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                  <FileText className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-heading text-text-primary mb-2 text-lg font-bold">
                  Phác đồ xử lý 3 lớp rõ ràng
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Hướng dẫn từng bước từ xử lý cấp bách trong ngày đến điều
                  chỉnh dinh dưỡng và phòng ngừa vụ sau.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {PROTOCOL_LAYERS.map((layer) => (
                  <span
                    key={layer}
                    className="bg-bg-subtle text-text-secondary rounded-md px-2 py-0.5 text-[11px] font-semibold"
                  >
                    {layer}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Card 4: Instant Results */}
          <Reveal className="lg:col-span-4">
            <div className="border-border bg-bg-card hover:border-primary/40 flex h-full flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md">
              <div>
                <div className="bg-primary-soft text-primary mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                  <Zap className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-heading text-text-primary mb-2 text-lg font-bold">
                  Phân tích tức thì dưới 5 giây
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Tối ưu cho điện thoại khi đi thăm đồng, kết hợp tự động bối
                  cảnh thời tiết tại khu vực của ruộng lúa.
                </p>
              </div>
              <div className="text-text-muted mt-5 flex items-center gap-2 text-xs font-semibold">
                <ShieldCheck className="text-primary h-4 w-4 shrink-0" />
                <span>Dữ liệu ruộng được bảo mật riêng tư</span>
              </div>
            </div>
          </Reveal>

          {/* Card 5: History & Community */}
          <Reveal className="md:col-span-2 lg:col-span-4">
            <div className="border-border bg-bg-card hover:border-primary/40 flex h-full flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md">
              <div>
                <div className="bg-info/15 text-info mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                  <History className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-heading text-text-primary mb-2 text-lg font-bold">
                  Nhật ký bệnh án & Diễn đàn
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Lưu trữ toàn bộ lịch sử quét theo thửa ruộng, đánh dấu tiến độ
                  xử lý và chia sẻ kinh nghiệm cùng cộng đồng nhà nông.
                </p>
              </div>
              <div className="text-primary mt-5 text-xs font-bold">
                Theo dõi xuyên suốt từng vụ mùa
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
