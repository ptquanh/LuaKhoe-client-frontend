import { Search } from "lucide-react";

export function EmptyResultView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-subtle)]">
        <Search className="h-8 w-8 text-[var(--text-muted)]" />
      </div>
      <p className="max-w-[220px] text-sm text-[var(--text-secondary)]">
        Kết quả sẽ hiển thị tại đây sau khi bạn tải ảnh lên
      </p>
    </div>
  );
}
