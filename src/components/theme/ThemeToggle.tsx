"use client";

import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "bg-bg-subtle h-11 w-11 animate-pulse rounded-xl sm:h-10 sm:w-10",
          className,
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      title={isDark ? "Chế độ sáng" : "Chế độ tối"}
      className={cn(
        "border-border bg-bg-card text-text-secondary hover:bg-bg-hover hover:text-text-primary focus-visible:ring-primary inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-95 sm:h-10 sm:w-10",
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px] text-amber-400" strokeWidth={1.75} />
      ) : (
        <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      )}
    </button>
  );
}
