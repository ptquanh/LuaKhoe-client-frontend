import { Search } from "lucide-react";

export function EmptyResultView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F2F5]">
        <Search className="h-8 w-8 text-[#9E9E9E]" />
      </div>
      <p className="max-w-[200px] text-[14px] text-[#5C5C5C]">
        Kết quả sẽ hiển thị tại đây sau khi bạn tải ảnh lên
      </p>
    </div>
  );
}
