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
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-gray-400">
            Giải đáp thắc mắc phổ biến về Lúa Khoẻ
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-gray-100 bg-white px-6 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-gray-800">
                {f.q}
                <span className="text-gray-400 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
