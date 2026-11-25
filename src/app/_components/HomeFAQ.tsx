import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Lúa Khoẻ có miễn phí không?",
    a: "Có! Bạn được miễn phí 10 lượt chẩn đoán mỗi ngày. Gói Premium với không giới hạn lượt và nhiều tính năng nâng cao chỉ từ 49,000đ/tháng.",
  },
  {
    q: "Tôi cần loại điện thoại gì để sử dụng?",
    a: "Bất kỳ smartphone có camera và kết nối internet đều sử dụng được. Ứng dụng chạy trên trình duyệt web, không cần cài đặt.",
  },
  {
    q: "Độ chính xác của AI là bao nhiêu?",
    a: "Mô hình AI của chúng tôi đạt độ chính xác trung bình 95.2% trên 20+ loại bệnh. Kết quả còn được chuyên gia kiểm duyệt để đảm bảo tin cậy.",
  },
  {
    q: "Dữ liệu ảnh của tôi có được bảo mật không?",
    a: "Hoàn toàn bảo mật. Ảnh chỉ được sử dụng cho mục đích chẩn đoán và cải thiện mô hình AI. Chúng tôi không chia sẻ dữ liệu với bên thứ ba.",
  },
  {
    q: "Tôi có thể sử dụng offline không?",
    a: "Hiện tại Lúa Khoẻ cần kết nối internet để gửi ảnh lên server AI. Chúng tôi đang phát triển tính năng offline cho phiên bản tiếp theo.",
  },
];

export default function HomeFAQ() {
  return (
    <section className="bg-[var(--bg-page)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-[var(--text-secondary)]">
            Giải đáp thắc mắc phổ biến về Lúa Khoẻ
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-6 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-[var(--text-primary)]">
                {f.q}
                <ChevronDown
                  className="h-4 w-4 text-[var(--text-muted)] transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
