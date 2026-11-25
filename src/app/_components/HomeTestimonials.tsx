import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    text: "Trước đây tôi mất cả tuần mới biết lúa bị bệnh gì. Giờ chỉ cần chụp ảnh là biết ngay, tiết kiệm rất nhiều chi phí thuốc.",
    name: "Nguyễn Văn Hùng",
    location: "An Giang",
  },
  {
    text: "Ứng dụng rất dễ sử dụng, tôi 60 tuổi mà vẫn dùng được. Kết quả chính xác, có cả hướng dẫn điều trị rất chi tiết.",
    name: "Trần Thị Mai",
    location: "Đồng Tháp",
  },
  {
    text: "Nhờ Lúa Khoẻ mà mùa vừa rồi tôi phát hiện bệnh đạo ôn sớm, cứu được gần 2 hecta lúa. Cảm ơn đội ngũ rất nhiều!",
    name: "Lê Minh Tâm",
    location: "Kiên Giang",
  },
];

export default function HomeTestimonials() {
  return (
    <section className="bg-[var(--bg-page)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
            Nông Dân Nói Gì Về Lúa Khoẻ?
          </h2>
          <p className="text-[var(--text-secondary)]">
            Hơn 50,000 nông dân đã tin tưởng sử dụng hệ thống của chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xs"
            >
              <div className="mb-3 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)] italic">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary)]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
