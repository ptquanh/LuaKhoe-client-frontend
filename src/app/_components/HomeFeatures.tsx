import {
  BarChart3,
  Globe,
  Smartphone,
  Target,
  UserCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";

const FEATURES = [
  {
    icon: Target,
    title: "Chẩn đoán chính xác 95%+",
    desc: "Mô hình AI được huấn luyện trên hàng trăm ngàn ảnh, nhận diện hơn 20 loại bệnh phổ biến trên lúa.",
  },
  {
    icon: Zap,
    title: "Kết quả trong 3 giây",
    desc: "Xử lý nhanh chóng nhờ hạ tầng cloud hiệu năng cao, không cần chờ đợi lâu.",
  },
  {
    icon: BarChart3,
    title: "Theo dõi lịch sử",
    desc: "Lưu trữ toàn bộ lịch sử chẩn đoán, biểu đồ thống kê giúp theo dõi tình trạng đồng ruộng.",
  },
  {
    icon: UserCheck,
    title: "Chuyên gia kiểm duyệt",
    desc: "Mọi kết quả AI đều được đội ngũ chuyên gia bệnh học lúa xác nhận trước khi trả về.",
  },
  {
    icon: Smartphone,
    title: "Thân thiện mobile",
    desc: "Giao diện tối ưu cho điện thoại, dễ sử dụng ngay tại đồng ruộng, hỗ trợ chụp ảnh trực tiếp.",
  },
  {
    icon: Globe,
    title: "Hoạt động mọi nơi",
    desc: "Sử dụng được ở bất kỳ đâu có kết nối internet, phục vụ nông dân trên toàn quốc.",
  },
];

export default function HomeFeatures() {
  return (
    <section className="bg-[var(--bg-page)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
            Tại Sao Chọn Lúa Khoẻ?
          </h2>
          <p className="text-[var(--text-secondary)]">
            Công nghệ AI tiên tiến kết hợp chuyên gia bệnh học lúa hàng đầu
          </p>
        </div>
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-semibold text-[var(--text-primary)]">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
