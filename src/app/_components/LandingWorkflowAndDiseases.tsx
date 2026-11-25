"use client";

import { Brain, Camera, ClipboardCheck, LineChart } from "lucide-react";

import { Reveal } from "./Reveal";

const STEPS = [
  {
    step: "01",
    title: "Chụp ảnh lá lúa",
    desc: "Chụp rõ vùng lá có triệu chứng dưới ánh sáng tự nhiên, giữ khoảng cách 15–25 cm.",
    icon: Camera,
  },
  {
    step: "02",
    title: "AI phân tích vùng bệnh",
    desc: "Hệ thống khoanh vùng tổn thương, kết hợp dữ liệu thời tiết và điều kiện ruộng.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Nhận phác đồ chi tiết",
    desc: "Xem ngay hướng dẫn hóa học, sinh học, canh tác và điều chỉnh phân bón N-P-K.",
    icon: ClipboardCheck,
  },
  {
    step: "04",
    title: "Theo dõi & đánh giá",
    desc: "Lưu bệnh án theo mùa vụ, đánh dấu việc cần làm và gửi phản hồi cho chuyên gia.",
    icon: LineChart,
  },
];

const DISEASES = [
  {
    name: "Bệnh đạo ôn",
    percent: 32,
    color: "#1F7A3E",
    symptom: "Vết bệnh hình thoi đặc trưng, tâm xám trắng, viền nâu sẫm.",
  },
  {
    name: "Bệnh bạc lá",
    percent: 25,
    color: "#0284C7",
    symptom: "Mép lá cháy dọc gợn sóng từ chóp lá xuống, dễ lan khi mưa gió.",
  },
  {
    name: "Bệnh khô vằn",
    percent: 18,
    color: "#D97706",
    symptom: "Vết loang màu xám xanh ở bẹ lá gần mặt nước, lan lên lá đòng.",
  },
  {
    name: "Bệnh đốm nâu",
    percent: 12,
    color: "#DC2626",
    symptom:
      "Đốm tròn màu nâu sẫm rải rác trên phiến lá, thường gặp khi thiếu dinh dưỡng.",
  },
  {
    name: "Bệnh vàng lùn",
    percent: 8,
    color: "#0F766E",
    symptom: "Lá chuyển vàng cam từ chóp xuống, bụi lúa lùn và xòe ngang.",
  },
  {
    name: "Lùn xoắn lá",
    percent: 5,
    color: "#00838F",
    symptom: "Lá xanh đậm, rách mép, chóp lá xoắn lại, trổ nghẹn.",
  },
];

export function LandingWorkflowAndDiseases() {
  return (
    <>
      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-border/60 bg-bg-card border-y py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal className="mb-12 text-center sm:mb-14">
            <span className="border-primary-border bg-primary-soft text-primary mb-3 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
              Quy trình 4 bước
            </span>
            <h2 className="font-heading text-text-primary mb-3 text-2xl font-extrabold tracking-tight sm:text-[36px]">
              Từ ảnh chụp lá lúa đến phác đồ điều trị
            </h2>
            <p className="text-text-secondary mx-auto max-w-[560px] text-sm sm:text-base">
              Thao tác đơn giản ngay ngoài ruộng, không cần kiến thức kỹ thuật
              phức tạp
            </p>
          </Reveal>

          <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div
              aria-hidden="true"
              className="border-border-strong pointer-events-none absolute top-11 right-[12%] left-[12%] hidden border-t-2 border-dashed lg:block"
            />
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.step}>
                  <div className="border-border bg-bg-page relative flex h-full flex-col rounded-2xl border p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="bg-primary-soft text-primary ring-bg-card relative z-10 flex h-12 w-12 items-center justify-center rounded-xl ring-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-text-muted font-mono text-2xl font-extrabold tracking-tight tabular-nums opacity-50">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-heading text-text-primary mb-2 text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DISEASES */}
      <section id="diseases" className="bg-bg-page py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal className="mb-12 text-center sm:mb-14">
            <span className="border-primary-border bg-primary-soft text-primary mb-3 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
              Danh mục nhận diện
            </span>
            <h2 className="font-heading text-text-primary mb-3 text-2xl font-extrabold tracking-tight sm:text-[36px]">
              Các bệnh lúa phổ biến được AI hỗ trợ
            </h2>
            <p className="text-text-secondary mx-auto max-w-[580px] text-sm sm:text-base">
              Nhận diện dấu hiệu đặc trưng trên lá và tỷ lệ ghi nhận thường gặp
              theo dữ liệu mùa vụ
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DISEASES.map((d) => (
              <Reveal key={d.name}>
                <div className="border-border bg-bg-card hover:border-primary/40 flex h-full flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-200 hover:shadow-md">
                  <div>
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: d.color }}
                        />
                        <h3 className="font-heading text-text-primary text-base font-bold">
                          {d.name}
                        </h3>
                      </div>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums"
                        style={{
                          backgroundColor: `${d.color}1C`,
                          color: d.color,
                        }}
                      >
                        {d.percent}%
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {d.symptom}
                    </p>
                  </div>

                  <div className="mt-4 pt-2">
                    <div className="text-text-muted mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                      <span>Tỷ lệ ghi nhận mẫu</span>
                      <span className="tabular-nums">{d.percent}%</span>
                    </div>
                    <div className="bg-bg-subtle h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(10, d.percent)}%`,
                          backgroundColor: d.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
