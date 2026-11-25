import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  inverted?: boolean;
  className?: string;
}

const sizeMap = {
  sm: {
    box: "h-8 w-8 rounded-lg",
    icon: "h-4 w-4",
    title: "text-[17px]",
  },
  md: {
    box: "h-9 w-9 rounded-xl",
    icon: "h-5 w-5",
    title: "text-[18px]",
  },
  lg: {
    box: "h-11 w-11 rounded-xl",
    icon: "h-6 w-6",
    title: "text-[21px]",
  },
};

export function BrandLogo({
  size = "md",
  subtitle,
  inverted = false,
  className,
}: BrandLogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "bg-primary inline-flex shrink-0 items-center justify-center text-white shadow-xs",
          s.box,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={s.icon}
        >
          <path
            d="M19.5 4.5C12.5 4.5 7 9 6 16.5C13.5 16 18.5 11.5 19.5 4.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 19.5C6.5 16.5 10 13.5 14.5 10.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="19.5" cy="4.5" r="1.8" fill="#f59e0b" />
        </svg>
      </span>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading font-bold tracking-tight",
            s.title,
            inverted ? "text-white" : "text-text-primary",
          )}
        >
          Lúa Khoẻ
        </span>
        {subtitle && (
          <span
            className={cn(
              "mt-0.5 text-[11px] font-semibold tracking-wider uppercase",
              inverted ? "text-white/75" : "text-primary",
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
