"use client";

import { FlaskConical, Sprout, Tractor } from "lucide-react";
import { useState } from "react";

import { renderStructuredProtocol, TreatmentStep } from "./protocolHelpers";

interface TreatmentProtocolCardProps {
  chemicalSteps?: string | TreatmentStep[] | string[];
  biologicalSteps?: string | TreatmentStep[] | string[];
  cultivationSteps?: string | string[];
}

type TabKey = "chemical" | "biological" | "cultivation";

const TABS: Array<{
  key: TabKey;
  label: string;
  shortDesc: string;
  icon: typeof FlaskConical;
  badgeBg: string;
  badgeText: string;
}> = [
  {
    key: "chemical",
    label: "Hóa học",
    shortDesc: "Tác dụng nhanh, ưu tiên khi bệnh lây lan rộng",
    icon: FlaskConical,
    badgeBg: "bg-accent-light",
    badgeText: "text-accent",
  },
  {
    key: "biological",
    label: "Sinh học",
    shortDesc: "An toàn hệ sinh thái ruộng, hạn chế kháng thuốc",
    icon: Sprout,
    badgeBg: "bg-primary-soft",
    badgeText: "text-primary",
  },
  {
    key: "cultivation",
    label: "Canh tác",
    shortDesc: "Điều tiết nước, phân bón và vệ sinh đồng ruộng",
    icon: Tractor,
    badgeBg: "bg-info/15",
    badgeText: "text-info",
  },
];

export function TreatmentProtocolCard({
  chemicalSteps,
  biologicalSteps,
  cultivationSteps,
}: TreatmentProtocolCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("chemical");

  const dataMap: Record<TabKey, unknown> = {
    chemical: chemicalSteps,
    biological: biologicalSteps,
    cultivation: cultivationSteps,
  };

  const currentTab = TABS.find((t) => t.key === activeTab) || TABS[0];
  const currentSteps = dataMap[activeTab];

  return (
    <section className="border-border bg-bg-card overflow-hidden rounded-2xl border shadow-xs">
      <div className="border-border space-y-4 border-b px-5 py-4 sm:px-6">
        <div>
          <h3 className="font-heading text-text-primary text-base font-bold sm:text-lg">
            Phác đồ điều trị chi tiết
          </h3>
          <p className="text-text-secondary mt-0.5 text-xs sm:text-sm">
            Chọn phương pháp phù hợp với giai đoạn sinh trưởng và điều kiện đồng
            ruộng
          </p>
        </div>

        {/* 3-Tab Segmented Switcher */}
        <div
          role="tablist"
          aria-label="Phương pháp điều trị"
          className="bg-bg-subtle grid grid-cols-3 gap-1 rounded-xl p-1"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-all sm:text-sm ${
                  isActive
                    ? "bg-bg-card text-text-primary shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? tab.badgeText : ""}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="border-border bg-bg-subtle/50 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${currentTab.badgeBg} ${currentTab.badgeText}`}
          >
            <currentTab.icon className="h-4 w-4" />
          </span>
          <span className="text-text-secondary font-medium">
            {currentTab.shortDesc}
          </span>
        </div>

        {renderStructuredProtocol(
          currentSteps,
          currentTab.badgeBg,
          currentTab.badgeText,
        )}
      </div>
    </section>
  );
}
