import { CheckCircle, Droplets, Leaf, Sun } from "lucide-react";

interface LegacyRagRecommendationProps {
  recommendation: {
    immediate_actions?: string[];
    treatment_protocol?: {
      chemical?: string;
      biological?: string;
      cultural?: string;
    };
    npk_adjustment?: string;
    prevention_measures?: string[];
  };
}

export function LegacyRagRecommendation({
  recommendation,
}: LegacyRagRecommendationProps) {
  return (
    <div className="space-y-4">
      {/* Immediate Actions */}
      {recommendation.immediate_actions &&
        recommendation.immediate_actions.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
              <CheckCircle className="h-4 w-4 text-[#2F9E44]" /> Hành động khẩn
              cấp
            </h4>
            <ul className="space-y-2 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
              {recommendation.immediate_actions.map(
                (item: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[14px] leading-[1.5] text-[#5C5C5C]"
                  >
                    <span className="mt-0.5 text-[#E53935]">•</span>{" "}
                    <span>{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

      {/* Treatment Protocol */}
      {recommendation.treatment_protocol && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
            <Droplets className="h-4 w-4 text-[#2F9E44]" /> Phác đồ điều trị
          </h4>
          <div className="space-y-3 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
            {recommendation.treatment_protocol.chemical &&
              recommendation.treatment_protocol.chemical !==
                "Không có dữ liệu trong tài liệu tham khảo" && (
                <div>
                  <strong className="text-[13px] text-[#1B1B1B]">
                    Hóa học:
                  </strong>
                  <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                    {recommendation.treatment_protocol.chemical}
                  </p>
                </div>
              )}
            {recommendation.treatment_protocol.biological &&
              recommendation.treatment_protocol.biological !==
                "Không có dữ liệu trong tài liệu tham khảo" && (
                <div>
                  <strong className="text-[13px] text-[#1B1B1B]">
                    Sinh học:
                  </strong>
                  <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                    {recommendation.treatment_protocol.biological}
                  </p>
                </div>
              )}
            {recommendation.treatment_protocol.cultural &&
              recommendation.treatment_protocol.cultural !==
                "Không có dữ liệu trong tài liệu tham khảo" && (
                <div>
                  <strong className="text-[13px] text-[#1B1B1B]">
                    Canh tác:
                  </strong>
                  <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">
                    {recommendation.treatment_protocol.cultural}
                  </p>
                </div>
              )}
          </div>
        </div>
      )}

      {/* NPK Adjustment */}
      {recommendation.npk_adjustment &&
        recommendation.npk_adjustment !==
          "Không có dữ liệu trong tài liệu tham khảo" && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
              <Leaf className="h-4 w-4 text-[#2F9E44]" /> Điều chỉnh dinh dưỡng
              (NPK)
            </h4>
            <p className="rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3 text-[14px] leading-[1.6] text-[#5C5C5C]">
              {recommendation.npk_adjustment}
            </p>
          </div>
        )}

      {/* Prevention Measures */}
      {recommendation.prevention_measures &&
        recommendation.prevention_measures.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[15px] font-[600] text-[#1B1B1B]">
              <Sun className="h-4 w-4 text-[#2F9E44]" /> Biện pháp phòng ngừa
            </h4>
            <ul className="space-y-2 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-3">
              {recommendation.prevention_measures.map(
                (item: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[14px] leading-[1.5] text-[#5C5C5C]"
                  >
                    <span className="mt-0.5 text-[#2F9E44]">•</span>{" "}
                    <span>{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
    </div>
  );
}
