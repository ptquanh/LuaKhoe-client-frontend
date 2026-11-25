"use client";

import { AlertTriangle } from "lucide-react";

export interface TreatmentStep {
  disease_name: string;
  steps: string[];
}

function formatMarkdownText(text: unknown): string {
  if (typeof text !== "string") return "";

  return text
    .replace(/\\n/g, "\n")
    .replace(/([^\n])\s*(###\s+)/g, "$1\n\n$2")
    .replace(/([^\n])\s*([-*•]\s+)/g, "$1\n$2")
    .replace(/(###\s+[^\n]+)\n([^\n])/g, "$1\n\n$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getRawText(val: unknown): string {
  if (typeof val === "string") return val;
  if (Array.isArray(val) && typeof val[0] === "string") {
    return val.join("\n");
  }
  return "";
}

function parseSteps(textOrArray: unknown): string[] {
  if (Array.isArray(textOrArray) && textOrArray.length > 0) {
    if (typeof textOrArray[0] === "string") {
      return textOrArray as string[];
    }
  }
  const text = getRawText(textOrArray);
  if (text.trim().length > 0) {
    return formatMarkdownText(text)
      .split(/\n|(?<=\.)\s+/)
      .filter((s) => s.trim().length > 0)
      .map((step) => step.replace(/^[•\d.-]\s*/, ""));
  }
  return [];
}

function isMarkdownFormat(val: unknown): boolean {
  const text = getRawText(val);
  return (
    text.includes("###") ||
    text.includes("**") ||
    text.includes("- ") ||
    text.includes("⚠️")
  );
}

function cleanWarningLabel(raw: string): string {
  return raw
    .replace(/⚠️/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="text-text-primary font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderStepList(list: string[], badgeBg: string, badgeText: string) {
  if (list.length === 0) {
    return (
      <div className="border-border bg-bg-subtle/40 text-text-secondary rounded-xl border border-dashed p-5 text-center text-sm italic">
        Chưa có thông tin phác đồ cụ thể cho phương pháp này.
      </div>
    );
  }
  return (
    <ul className="space-y-2.5">
      {list.map((step, i) => (
        <li
          key={i}
          className="border-border/70 bg-bg-subtle/50 flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm leading-relaxed sm:text-[15px]"
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums ${badgeBg} ${badgeText}`}
          >
            {i + 1}
          </span>
          <span className="text-text-primary flex-1 font-medium">
            {renderBoldText(cleanWarningLabel(step))}
          </span>
        </li>
      ))}
    </ul>
  );
}

function renderMarkdownBlock(text: string) {
  const lines = formatMarkdownText(text).split("\n");

  return (
    <div className="text-text-secondary space-y-3 text-sm leading-relaxed sm:text-[15px]">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("###")) {
          const rawContent = trimmed.replace(/^###\s*/, "");
          const isWarning =
            rawContent.includes("⚠️") ||
            rawContent.includes("Khuyến nghị") ||
            rawContent.includes("Cảnh báo");
          const cleanContent = cleanWarningLabel(rawContent);

          if (isWarning) {
            return (
              <div
                key={i}
                className="border-warning/35 bg-accent-light/50 text-accent mt-2 flex w-full items-start gap-2.5 rounded-xl border p-3.5 text-sm font-bold"
              >
                <AlertTriangle className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                <span>{renderBoldText(cleanContent)}</span>
              </div>
            );
          }
          return (
            <h4
              key={i}
              className="font-heading border-primary text-text-primary mt-4 flex items-center border-l-[3px] pl-3 text-base font-bold first:mt-0"
            >
              {renderBoldText(cleanContent)}
            </h4>
          );
        }

        if (
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          trimmed.startsWith("• ")
        ) {
          const content = cleanWarningLabel(trimmed.replace(/^[-*•]\s*/, ""));
          return (
            <div
              key={i}
              className="border-border/70 bg-bg-subtle/40 flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5"
            >
              <span className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
              <span className="text-text-primary text-sm leading-relaxed font-medium">
                {renderBoldText(content)}
              </span>
            </div>
          );
        }

        if (/^\d+\.\s+/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s*(.*)$/);
          const num = match?.[1] || "•";
          const content = cleanWarningLabel(match?.[2] || trimmed);
          return (
            <div
              key={i}
              className="border-border/70 bg-bg-subtle/40 flex items-start gap-3 rounded-xl border px-3.5 py-2.5"
            >
              <span className="bg-primary-soft text-primary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums">
                {num}
              </span>
              <span className="text-text-primary text-sm leading-relaxed font-medium">
                {renderBoldText(content)}
              </span>
            </div>
          );
        }

        return (
          <p
            key={i}
            className="text-text-secondary text-sm leading-relaxed font-medium"
          >
            {renderBoldText(cleanWarningLabel(trimmed))}
          </p>
        );
      })}
    </div>
  );
}

export function renderStructuredProtocol(
  stepsData: unknown,
  badgeBg: string,
  badgeText: string,
) {
  if (!stepsData) {
    return renderStepList([], badgeBg, badgeText);
  }

  if (typeof stepsData === "string") {
    return isMarkdownFormat(stepsData)
      ? renderMarkdownBlock(stepsData)
      : renderStepList(parseSteps(stepsData), badgeBg, badgeText);
  }

  if (Array.isArray(stepsData)) {
    if (stepsData.length === 0) {
      return renderStepList([], badgeBg, badgeText);
    }

    if (typeof stepsData[0] === "string") {
      return renderStepList(stepsData as string[], badgeBg, badgeText);
    }

    return (
      <div className="space-y-5">
        {(stepsData as TreatmentStep[]).map((item, i) => {
          const diseaseName = item.disease_name || "";
          const steps = item.steps || [];
          if (steps.length === 0) return null;

          const isWarning =
            diseaseName.includes("⚠️") ||
            diseaseName.includes("Khuyến nghị") ||
            diseaseName.includes("Cảnh báo");
          const cleanTitle = cleanWarningLabel(diseaseName);

          if (isWarning) {
            return (
              <div
                key={i}
                className="border-warning/35 bg-accent-light/50 w-full rounded-xl border p-4 text-sm"
              >
                <div className="text-accent mb-2 flex items-center gap-2 font-bold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{cleanTitle}</span>
                </div>
                <ul className="text-text-primary list-disc space-y-1.5 pl-5 font-medium">
                  {steps.map((step, sIdx) => (
                    <li key={sIdx} className="leading-relaxed">
                      {renderBoldText(cleanWarningLabel(step))}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return (
            <div key={i} className="space-y-3">
              <h4 className="font-heading border-primary text-text-primary flex items-center border-l-[3px] pl-3 text-[15px] font-bold">
                {cleanTitle}
              </h4>
              {renderStepList(steps, badgeBg, badgeText)}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
