import { CheckCircleIcon, XCircleIcon } from "./Icons";

export default function DiagnoseExamples() {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Ảnh tốt */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <CheckCircleIcon />
            <span>Ảnh tốt — AI phân tích chính xác</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/good-1.jpg')" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 text-xs text-white">
                Rõ nét, đủ sáng
              </div>
              <div className="absolute top-2 right-2 rounded-full bg-green-500/20 p-0.5 text-green-400 backdrop-blur-sm">
                <CheckCircleIcon />
              </div>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/good-2.jpg')" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 text-xs text-white">
                Thấy rõ vết bệnh
              </div>
              <div className="absolute top-2 right-2 rounded-full bg-green-500/20 p-0.5 text-green-400 backdrop-blur-sm">
                <CheckCircleIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Ảnh xấu */}
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-4">
          <div className="flex items-center gap-2 text-sm font-medium text-red-500">
            <XCircleIcon />
            <span>Ảnh xấu — Kết quả không chính xác</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/bad-1.jpg')" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2 left-2 text-xs text-white">
                Bị mờ, không rõ
              </div>
              <div className="absolute top-2 right-2 rounded-full bg-red-500/20 p-0.5 text-red-400 backdrop-blur-sm">
                <XCircleIcon />
              </div>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/bad-2.jpg')" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2 left-2 text-xs text-white">
                Quá tối, thiếu sáng
              </div>
              <div className="absolute top-2 right-2 rounded-full bg-red-500/20 p-0.5 text-red-400 backdrop-blur-sm">
                <XCircleIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
