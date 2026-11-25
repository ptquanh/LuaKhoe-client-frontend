"use client";

import { History, LogIn, Stethoscope, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const items = [
    {
      href: ROUTES.DIAGNOSE,
      label: "Chẩn đoán",
      icon: Stethoscope,
      active:
        pathname.startsWith(ROUTES.DIAGNOSE) ||
        pathname.startsWith(ROUTES.RESULT),
    },
    {
      href: ROUTES.HISTORY,
      label: "Lịch sử",
      icon: History,
      active: pathname.startsWith(ROUTES.HISTORY),
    },
    {
      href: ROUTES.FORUM,
      label: "Diễn đàn",
      icon: Users,
      active: pathname.startsWith(ROUTES.FORUM),
    },
    mounted && user
      ? {
          href: ROUTES.PROFILE,
          label: "Cá nhân",
          icon: User,
          active: pathname.startsWith(ROUTES.PROFILE),
        }
      : {
          href: ROUTES.LOGIN,
          label: "Đăng nhập",
          icon: LogIn,
          active: pathname.startsWith(ROUTES.LOGIN),
        },
  ];

  return (
    <nav
      aria-label="Điều hướng di động"
      className="border-border bg-bg-card/95 pb-safe fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md md:hidden"
    >
      <div className="grid h-[62px] grid-cols-4 items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "focus-visible:ring-primary flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 transition-all focus-visible:ring-2 focus-visible:outline-none active:scale-95",
                item.active
                  ? "text-primary font-semibold"
                  : "text-text-secondary hover:text-text-primary font-medium",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                  item.active ? "bg-primary-light" : "bg-transparent",
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </span>
              <span className="truncate text-[11px] leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
