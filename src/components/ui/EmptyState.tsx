import React from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-bg-card flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="bg-primary-light text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
          {icon}
        </div>
      )}
      <p className="font-heading text-text-primary text-base font-semibold">
        {title}
      </p>
      {description && (
        <p className="text-text-secondary mt-1 max-w-md text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
