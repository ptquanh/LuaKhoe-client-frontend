const DISEASES = [
  {
    name: "Đạo ôn (Blast)",
    percent: "32%",
    level: "Cao",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    name: "Bạc lá (Bacterial Leaf Blight)",
    percent: "25%",
    level: "Cao",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    name: "Khô vằn (Sheath Blight)",
    percent: "18%",
    level: "Trung bình",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    name: "Đốm nâu (Brown Spot)",
    percent: "12%",
    level: "Trung bình",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    name: "Vàng lá (Tungro)",
    percent: "8%",
    level: "Thấp",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    name: "Sâu cuốn lá nhỏ",
    percent: "5%",
    level: "Thấp",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

export default function HomeDiseases() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Bệnh Phổ Biến Trên Lúa
          </h2>
          <p className="text-gray-400">
            Các loại bệnh thường gặp mà hệ thống AI của chúng tôi có thể nhận
            diện
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {DISEASES.map((d) => (
            <div
              key={d.name}
              className={`${d.bg} flex items-center justify-between rounded-2xl p-5`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                <span className={`text-xs font-medium ${d.color}`}>
                  {d.level}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-300">
                {d.percent}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
