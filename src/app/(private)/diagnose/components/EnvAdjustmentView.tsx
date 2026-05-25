import { CloudRain, Droplets, Info, Thermometer, Wind } from "lucide-react";
import { EnvAdjustment } from "@/types/diagnose.type";

interface EnvAdjustmentViewProps {
  adjustment: EnvAdjustment;
}

export function EnvAdjustmentView({ adjustment }: EnvAdjustmentViewProps) {
  if (!adjustment || !adjustment.applied) return null;

  const { weather } = adjustment;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-[#F8F9FA] px-4 py-3 border-b border-[#E0E0E0]">
        <Info className="h-4 w-4 text-[#2F9E44]" />
        <h4 className="text-[14px] font-[600] text-[#1B1B1B]">Yếu tố môi trường & Thời tiết</h4>
      </div>
      
      <div className="p-4">
        {/* Weather Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#FFF3E0]/30 p-3">
            <Thermometer className="h-5 w-5 text-[#EF6C00]" />
            <div>
              <p className="text-[10px] font-[500] text-[#5C5C5C] uppercase">Nhiệt độ</p>
              <p className="text-[14px] font-[700] text-[#1B1B1B]">{weather.temperature}°C</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 rounded-lg bg-[#E3F2FD]/30 p-3">
            <Droplets className="h-5 w-5 text-[#1976D2]" />
            <div>
              <p className="text-[10px] font-[500] text-[#5C5C5C] uppercase">Độ ẩm</p>
              <p className="text-[14px] font-[700] text-[#1B1B1B]">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-[#E1F5FE]/30 p-3">
            <CloudRain className="h-5 w-5 text-[#0288D1]" />
            <div>
              <p className="text-[10px] font-[500] text-[#5C5C5C] uppercase">Lượng mưa</p>
              <p className="text-[14px] font-[700] text-[#1B1B1B] capitalize">
                {weather.rainfall === "none" ? "Không" : weather.rainfall === "light" ? "Nhẹ" : "To"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-[#F1F8E9]/30 p-3">
            <Wind className="h-5 w-5 text-[#33691E]" />
            <div>
              <p className="text-[10px] font-[500] text-[#5C5C5C] uppercase">Sức gió</p>
              <p className="text-[14px] font-[700] text-[#1B1B1B] capitalize">
                {weather.wind === "calm" ? "Lặng" : weather.wind === "moderate" ? "Vừa" : "Mạnh"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#E8F5E9] bg-[#F1F8E9]/20 p-3 text-[12px] text-[#2E7D32] leading-relaxed">
          <p className="font-[600] mb-1">💡 Phân tích của AI:</p>
          Dựa trên điều kiện thời tiết tại địa phương ({weather.source === "api" ? "Dữ liệu Open-Meteo" : "Dữ liệu mặc định"}) và thông số thực địa bạn cung cấp, AI đã tự động điều chỉnh độ tin cậy để đưa ra kết quả chính xác nhất.
        </div>
      </div>
    </div>
  );
}
