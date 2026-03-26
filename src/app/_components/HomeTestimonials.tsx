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
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Nông Dân Nói Gì Về Lúa Khoẻ?
          </h2>
          <p className="text-gray-400">
            Hơn 50,000 nông dân đã tin tưởng sử dụng hệ thống của chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-600 italic">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
