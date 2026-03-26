import Image from "next/image";

const FEATURES = [
  {
    icon: "🎯",
    title: "Chẩn đoán chính xác 95%+",
    desc: "Mô hình AI được huấn luyện trên hàng trăm ngàn ảnh, nhận diện hơn 20 loại bệnh phổ biến trên lúa.",
  },
  {
    icon: "⚡",
    title: "Kết quả trong 3 giây",
    desc: "Xử lý nhanh chóng nhờ hạ tầng cloud hiệu năng cao, không cần chờ đợi lâu.",
  },
  {
    icon: "📊",
    title: "Theo dõi lịch sử",
    desc: "Lưu trữ toàn bộ lịch sử chẩn đoán, biểu đồ thống kê giúp theo dõi tình trạng đồng ruộng.",
  },
  {
    icon: "👨‍🔬",
    title: "Chuyên gia kiểm duyệt",
    desc: "Mọi kết quả AI đều được đội ngũ chuyên gia bệnh học lúa xác nhận trước khi trả về.",
  },
  {
    icon: "📱",
    title: "Thân thiện mobile",
    desc: "Giao diện tối ưu cho điện thoại, dễ sử dụng ngay tại đồng ruộng, hỗ trợ chụp ảnh trực tiếp.",
  },
  {
    icon: "🌐",
    title: "Hoạt động mọi nơi",
    desc: "Sử dụng được ở bất kỳ đâu có kết nối internet, phục vụ nông dân trên toàn quốc.",
  },
];

export default function HomeFeatures() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Tại Sao Chọn Lúa Khoẻ?
          </h2>
          <p className="text-gray-400">
            Công nghệ AI tiên tiến kết hợp chuyên gia bệnh học lúa hàng đầu
          </p>
        </div>
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"
            alt="Đồng lúa"
            width={800}
            height={208}
            className="h-52 w-full rounded-2xl object-cover"
          />
          <Image
            src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800"
            alt="Lá lúa xanh"
            width={800}
            height={208}
            className="h-52 w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
