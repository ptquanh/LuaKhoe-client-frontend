"use client";

import React from "react";
import { FlaskConical, Sprout, Tractor } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TreatmentStep {
  disease_name: string;
  steps: string[];
}

interface TreatmentProtocolCardProps {
  chemicalSteps?: string | TreatmentStep[] | string[];
  biologicalSteps?: string | TreatmentStep[] | string[];
  cultivationSteps?: string | string[];
}

export function TreatmentProtocolCard({
  chemicalSteps,
  biologicalSteps,
  cultivationSteps,
}: TreatmentProtocolCardProps) {
  
  const formatMarkdownText = (text: any): string => {
    if (typeof text !== "string") return "";
    
    // 1. Replace literal escaped "\n" characters with actual newlines
    let formatted = text.replace(/\\n/g, "\n");
    
    // 2. Force newlines before headings if they are squashed mid-line
    formatted = formatted.replace(/([^\n])\s*(###\s+)/g, "$1\n\n$2");
    
    // 3. Force newlines before warning/advisory headings
    formatted = formatted.replace(/([^\n])\s*(###\s*⚠️)/g, "$1\n\n$2");
    
    // 4. Force newlines before list bullets (- or * or •)
    formatted = formatted.replace(/([^\n])\s*([\-\*•]\s+)/g, "$1\n$2");
    
    // 5. Ensure headings have a blank line after them to format correctly
    formatted = formatted.replace(/(###\s+[^\n]+)\n([^\n])/g, "$1\n\n$2");
    
    // 6. Clean up excessive duplicate newlines
    formatted = formatted.replace(/\n{3,}/g, "\n\n");
    
    return formatted.trim();
  };

  const getRawText = (val: any): string => {
    if (typeof val === "string") return val;
    if (Array.isArray(val)) {
      if (typeof val[0] === "string") {
        return val.join("\n");
      }
    }
    return "";
  };

  const parseSteps = (textOrArray: any): string[] => {
    if (Array.isArray(textOrArray) && textOrArray.length > 0) {
      if (typeof textOrArray[0] === "string") {
        return textOrArray as string[];
      }
    }
    const text = getRawText(textOrArray);
    if (text.trim().length > 0) {
      const formatted = formatMarkdownText(text);
      return formatted
        .split(/\n|(?<=\.)\s+/)
        .filter((s) => s.trim().length > 0)
        .map((step) => step.replace(/^[•\-\d.]\s*/, ""));
    }
    return [];
  };

  const isMarkdownFormat = (val: any): boolean => {
    const text = getRawText(val);
    return text.includes("###") || text.includes("**") || text.includes("- ") || text.includes("⚠️");
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
            <span className="flex-1 font-[500] text-[#1B1B1B]">{renderBoldText(step)}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-[700] text-[#1B1B1B]">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (text: string) => {
    const cleanText = formatMarkdownText(text);
    const lines = cleanText.split('\n');
    
    return (
      <div className="px-6 pt-2 pb-5 text-[15px] leading-[1.7] text-[#4B5563] space-y-3.5">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          // Headings
          if (trimmed.startsWith("###")) {
            const content = trimmed.replace(/^###\s*/, "");
            const isWarning = content.includes("⚠️") || content.includes("Khuyến nghị") || content.includes("Cảnh báo");
            if (isWarning) {
              return (
                <div key={i} className="mt-6 mb-3 text-[15px] font-[700] text-[#B45309] flex items-start gap-2.5 bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl shadow-sm w-full">
                  {renderBoldText(content)}
                </div>
              );
            }
            return (
              <h3 key={i} className="mt-6 mb-3 text-[16px] font-[700] text-[#1B1B1B] flex items-center gap-2.5 border-l-4 border-[#2F9E44] pl-3 w-full">
                {renderBoldText(content)}
              </h3>
            );
          }

          // Bullet lists
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
            const content = trimmed.replace(/^[\-*•]\s*/, "");
            return (
              <ul key={i} className="list-disc pl-5.5 space-y-1">
                <li className="text-[14.5px] leading-[1.6] text-[#4B5563] font-[500] marker:text-[#2F9E44]">
                  {renderBoldText(content)}
                </li>
              </ul>
            );
          }

          // Numbered lists
          if (/^\d+\.\s+/.test(trimmed)) {
            const content = trimmed.replace(/^\d+\.\s*/, "");
            return (
              <ol key={i} className="list-decimal pl-5.5 space-y-1">
                <li className="text-[14.5px] leading-[1.6] text-[#4B5563] font-[500]">
                  {renderBoldText(content)}
                </li>
              </ol>
            );
          }

          // Standard paragraph
          return (
            <p key={i} className="text-[14.5px] leading-[1.6] text-[#4B5563] font-[500]">
              {renderBoldText(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  const renderStructuredProtocol = (stepsData: any, badgeBg: string, badgeText: string) => {
    if (!stepsData) {
      return (
        <div className="px-6 py-4 text-[14px] text-[#757575] italic">
          Chưa có thông tin phác đồ cụ thể cho phương pháp này.
        </div>
      );
    }
    
    // If it's a string, use markdown or list rendering
    if (typeof stepsData === "string") {
      return isMarkdownFormat(stepsData)
        ? renderMarkdown(stepsData)
        : renderList(parseSteps(stepsData), badgeBg, badgeText);
    }
    
    if (Array.isArray(stepsData)) {
      if (stepsData.length === 0) {
        return (
          <div className="px-6 py-4 text-[14px] text-[#757575] italic">
            Chưa có thông tin phác đồ cụ thể cho phương pháp này.
          </div>
        );
      }
      
      // If it's a simple list of strings (like cultivation steps)
      if (typeof stepsData[0] === "string") {
        return renderList(stepsData, badgeBg, badgeText);
      }
      
      // If it's an array of TreatmentStep objects
      return (
        <div className="px-6 pt-2 pb-5 space-y-5">
          {stepsData.map((item: TreatmentStep, i: number) => {
            const diseaseName = item.disease_name || "";
            const steps = item.steps || [];
            
            if (steps.length === 0) return null;
            
            const isWarning = diseaseName.includes("⚠️") || diseaseName.includes("Khuyến nghị") || diseaseName.includes("Cảnh báo");
            
            return (
              <div key={i} className="space-y-3">
                {isWarning ? (
                  <div className="text-[14.5px] font-[700] text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl shadow-sm w-full">
                    <div className="font-[700] mb-2">{diseaseName}</div>
                    <ul className="list-disc pl-5 space-y-1.5 font-[500] text-[#4B5563]">
                      {steps.map((step: string, sIdx: number) => (
                        <li key={sIdx} className="leading-[1.6]">
                          {renderBoldText(step)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-[15.5px] font-[700] text-[#1B1B1B] flex items-center gap-2.5 border-l-4 border-[#2F9E44] pl-3 w-full">
                      {diseaseName}
                    </h4>
                    <ul className="space-y-2.5 pl-3">
                      {steps.map((step: string, sIdx: number) => (
                        <li
                          key={sIdx}
                          className="flex items-start gap-3 text-[14.5px] leading-[1.6] text-[#4B5563] font-[500]"
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-[700] shadow-sm ${badgeBg} ${badgeText}`}
                          >
                            {sIdx + 1}
                          </span>
                          <span className="flex-1 font-[500] text-[#1B1B1B]">{renderBoldText(step)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    
    return null;
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
            {renderStructuredProtocol(chemicalSteps, "bg-[#FFF3E0]", "text-[#E65100]")}
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
            {renderStructuredProtocol(biologicalSteps, "bg-[#E6F4EA]", "text-[#2F9E44]")}
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
            {renderStructuredProtocol(cultivationSteps, "bg-[#E3F2FD]", "text-[#1976D2]")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
