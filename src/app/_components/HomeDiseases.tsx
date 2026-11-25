const DISEASES = [
  {
    name: "Đạo ôn (Blast)",
    percent: "32%",
    level: "Cao",
    color: "text-red-600 dark:text-red-400",
    bg: "border-red-200 bg-red-50/70 dark:border-red-900/50 dark:bg-red-950/30",
  },
  {
    name: "Bạc lá (Bacterial Leaf Blight)",
    percent: "25%",
    level: "Cao",
    color: "text-red-600 dark:text-red-400",
    bg: "border-red-200 bg-red-50/70 dark:border-red-900/50 dark:bg-red-950/30",
  },
  {
    name: "Khô vằn (Sheath Blight)",
    percent: "18%",
    level: "Trung bình",
    color: "text-amber-700 dark:text-amber-400",
    bg: "border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/30",
  },
  {
    name: "Đốm nâu (Brown Spot)",
    percent: "12%",
    level: "Trung bình",
    color: "text-amber-700 dark:text-amber-400",
    bg: "border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/30",
  },
  {
    name: "Vàng lá (Tungro)",
    percent: "8%",
    level: "Thấp",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/30",
  },
  {
    name: "Sâu cuốn lá nhỏ",
    percent: "5%",
    level: "Thấp",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/30",
  },
];

export default function HomeDiseases() {
  return (
    <section className="bg-[var(--bg-card)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
            Bệnh Phổ Biến Trên Lúa
          </h2>
          <p className="text-[var(--text-secondary)]">
            Các loại bệnh thường gặp mà hệ thống AI của chúng tôi có thể nhận
            diện
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {DISEASES.map((d) => (
            <div
              key={d.name}
              className={`${d.bg} flex items-center justify-between rounded-2xl border p-5`}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {d.name}
                </p>
                <span className={`text-xs font-medium ${d.color}`}>
                  {d.level}
                </span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-muted)]/60 tabular-nums">
                {d.percent}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
