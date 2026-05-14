"use client";

import { FlaskConical, Sprout, Tractor } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TreatmentProtocolCardProps {
  chemicalSteps?: string[] | string;
  biologicalSteps?: string[] | string;
  cultivationSteps?: string[] | string;
}

export function TreatmentProtocolCard({
  chemicalSteps,
  biologicalSteps,
  cultivationSteps,
}: TreatmentProtocolCardProps) {
  const parseSteps = (textOrArray: any): string[] => {
    if (Array.isArray(textOrArray) && textOrArray.length > 0) {
      return textOrArray;
    }
    if (typeof textOrArray === "string" && textOrArray.trim().length > 0) {
      return textOrArray
        .split(/\n|(?<=\.)\s+/)
        .filter((s) => s.trim().length > 0)
        .map((step) => step.replace(/^[•\-\d.]\s*/, ""));
    }
    return [];
  };

  const chemList = parseSteps(chemicalSteps);
  const bioList = parseSteps(biologicalSteps);
  const cultList = parseSteps(cultivationSteps);

  const renderList = (list: string[], badgeBg: string, badgeText: string) => {
    if (list.length === 0) {
      return (
        <div className="px-6 py-4 text-[14px] text-[#757575] italic">
          Chưa có thông tin phác đồ cụ thể cho phương pháp này.
        </div>
      );
    }
    return (
      <ul className="space-y-3 px-6 pt-2 pb-4">
        {list.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-3.5 text-[15px] leading-[1.6] text-[#5C5C5C]"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-[700] shadow-sm ${badgeBg} ${badgeText}`}
            >
              {i + 1}
            </span>
            <span className="flex-1 font-[500] text-[#1B1B1B]">{step}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white shadow-sm transition-all hover:shadow-md">
      <div className="border-b border-[#E0E0E0] bg-[#F7F7F7] px-6 py-4.5">
        <h3 className="text-[18px] font-[700] text-[#1B1B1B]">
          Phác đồ điều trị chi tiết
        </h3>
        <p className="mt-1 text-[13px] text-[#5C5C5C]">
          Lựa chọn phương pháp phù hợp với giai đoạn sinh trưởng và điều kiện
          ruộng của bạn
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="chemical"
        className="w-full"
      >
        {/* Chemical */}
        <AccordionItem value="chemical" className="border-b border-[#E0E0E0]">
          <AccordionTrigger className="px-6 py-4.5 text-[16px] font-[700] text-[#1B1B1B] transition-colors hover:bg-[#FFF9F0] [&[data-state=open]]:bg-[#FFF9F0]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3E0] text-[#E65100]">
                <FlaskConical className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span>🧪 Phương pháp Hóa học</span>
                <span className="text-[12px] font-[500] text-[#757575]">
                  Tác dụng nhanh, dập dịch hiệu quả cao
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderList(chemList, "bg-[#FFF3E0]", "text-[#E65100]")}
          </AccordionContent>
        </AccordionItem>

        {/* Biological */}
        <AccordionItem value="biological" className="border-b border-[#E0E0E0]">
          <AccordionTrigger className="px-6 py-4.5 text-[16px] font-[700] text-[#1B1B1B] transition-colors hover:bg-[#E6F4EA]/50 [&[data-state=open]]:bg-[#E6F4EA]/40">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F4EA] text-[#2F9E44]">
                <Sprout className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span>🌱 Phương pháp Sinh học</span>
                <span className="text-[12px] font-[500] text-[#757575]">
                  An toàn môi trường, bền vững lâu dài
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderList(bioList, "bg-[#E6F4EA]", "text-[#2F9E44]")}
          </AccordionContent>
        </AccordionItem>

        {/* Cultivation */}
        <AccordionItem value="cultivation">
          <AccordionTrigger className="px-6 py-4.5 text-[16px] font-[700] text-[#1B1B1B] transition-colors hover:bg-[#E3F2FD]/50 [&[data-state=open]]:bg-[#E3F2FD]/40">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E3F2FD] text-[#1976D2]">
                <Tractor className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span>🚜 Kỹ thuật Canh tác</span>
                <span className="text-[12px] font-[500] text-[#757575]">
                  Phòng bệnh chủ động, cải tạo đất ruộng
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderList(cultList, "bg-[#E3F2FD]", "text-[#1976D2]")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
