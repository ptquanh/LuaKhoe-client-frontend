"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

interface UrgentActionsCardProps {
  urgentActions: string[];
  checkedActions: boolean[];
  // eslint-disable-next-line no-unused-vars
  onToggleAction: (index: number) => void;
}

export function UrgentActionsCard({
  urgentActions,
  checkedActions,
  onToggleAction,
}: UrgentActionsCardProps) {
  const completedCount = checkedActions.filter(Boolean).length;
  const totalCount = urgentActions.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="border-border bg-bg-card overflow-hidden rounded-2xl border shadow-xs">
      <div className="border-border border-b px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent-light text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-text-primary text-base font-bold sm:text-lg">
                Việc cần làm ngay hôm nay
              </h3>
              <p className="text-text-secondary text-xs sm:text-sm">
                Đánh dấu từng bước để kiểm soát tốc độ lây lan trên ruộng
              </p>
            </div>
          </div>

          <div className="border-border bg-bg-subtle flex items-center gap-2.5 self-start rounded-xl border px-3 py-1.5 sm:self-center">
            <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
            <span className="text-text-secondary text-xs font-semibold">
              Hoàn thành
            </span>
            <span className="text-primary text-sm font-extrabold tabular-nums">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-border mt-3.5 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2.5 p-4 sm:p-6">
        {urgentActions.map((action, i) => {
          const isChecked = checkedActions[i] || false;
          return (
            <label
              key={i}
              className={`group flex min-h-12 cursor-pointer items-start gap-3.5 rounded-xl border p-3.5 transition-all duration-200 sm:p-4 ${
                isChecked
                  ? "border-primary-border bg-primary-soft/60 text-text-muted"
                  : "border-border bg-bg-subtle/40 hover:border-primary/40 hover:bg-bg-subtle"
              }`}
            >
              <div className="relative flex items-center justify-center pt-0.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleAction(i)}
                  className="peer border-border-strong bg-bg-card checked:border-primary checked:bg-primary hover:border-primary h-5 w-5 cursor-pointer appearance-none rounded-md border-2 transition-all focus:outline-none"
                />
                <svg
                  className="pointer-events-none absolute h-3.5 w-3.5 stroke-white stroke-[3] opacity-0 transition-opacity peer-checked:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span
                className={`text-sm leading-relaxed font-medium transition-all duration-200 sm:text-[15px] ${
                  isChecked
                    ? "text-text-muted line-through"
                    : "text-text-primary"
                }`}
              >
                {action}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
