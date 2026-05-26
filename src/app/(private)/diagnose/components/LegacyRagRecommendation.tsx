import { CheckCircle, Droplets, Leaf, Sun } from "lucide-react";

interface LegacyRagRecommendationProps {
  recommendation: {
    immediate_actions?: string[];
    treatment_protocol?: {
      chemical?: any;
      biological?: any;
      cultural?: any;
    };
    npk_adjustment?: string;
    prevention_measures?: string[];
  };
}

export function LegacyRagRecommendation({
  recommendation,
}: LegacyRagRecommendationProps) {
  const renderProtocolValue = (val: any) => {
    if (!val) return null;
    if (typeof val === "string") {
      if (val === "Không có dữ liệu trong tài liệu tham khảo") return null;
      return (
        <p className="mt-1 text-[14px] leading-[1.5] text-[#5C5C5C]">{val}</p>
      );
    }
    if (Array.isArray(val)) {
      if (val.length === 0) return null;
      if (typeof val[0] === "string") {
        return (
          <ul className="mt-1 list-disc space-y-1 pl-4.5">
            {val.map((item: string, idx: number) => (
              <li
                key={idx}
                className="text-[14px] leading-[1.5] text-[#5C5C5C]"
              >
                {item}
              </li>
            ))}
          </ul>
        );
      }
      // Array of objects (TreatmentStep: { disease_name: string, steps: string[] })
      return (
        <div className="mt-2 space-y-3">
          {val.map((item: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <span className="block text-[13.5px] font-[600] text-[#1B1B1B]">
                {item.disease_name}
              </span>
              <ul className="list-disc space-y-1 pl-4.5">
                {item.steps?.map((step: string, sIdx: number) => (
                  <li
                    key={sIdx}
                    className="text-[13.5px] leading-[1.5] text-[#5C5C5C]"
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

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
            {recommendation.treatment_protocol.chemical && (
              <div>
                <strong className="text-[13px] text-[#1B1B1B]">Hóa học:</strong>
                {renderProtocolValue(
                  recommendation.treatment_protocol.chemical,
                )}
              </div>
            )}
            {recommendation.treatment_protocol.biological && (
              <div>
                <strong className="text-[13px] text-[#1B1B1B]">
                  Sinh học:
                </strong>
                {renderProtocolValue(
                  recommendation.treatment_protocol.biological,
                )}
              </div>
            )}
            {recommendation.treatment_protocol.cultural && (
              <div>
                <strong className="text-[13px] text-[#1B1B1B]">
                  Canh tác:
                </strong>
                {renderProtocolValue(
                  recommendation.treatment_protocol.cultural,
                )}
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
