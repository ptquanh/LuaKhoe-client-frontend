"use client";

import {
  ChevronDown,
  History,
  LogOut,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ROLE } from "@/types/auth.type";

const emptySubscribe = () => () => {};

const navItems = [
  {
    path: ROUTES.DIAGNOSE,
    label: "Chẩn đoán",
    icon: Stethoscope,
  },
  {
    path: ROUTES.HISTORY,
    label: "Lịch sử",
    icon: History,
  },
  {
    path: ROUTES.FORUM,
    label: "Diễn đàn",
    icon: Users,
  },
];

export default function SharedHeader() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const showUserMenu = openMenuPath === pathname;

  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuPath(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenuPath(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showUserMenu]);

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = () => {
    setOpenMenuPath(null);
    logout();
    router.push(ROUTES.LOGIN);
  };

  const renderUserArea = () => {
    if (!mounted) {
      return (
        <div
          aria-hidden="true"
          className="bg-bg-subtle h-10 w-10 animate-pulse rounded-full"
        />
      );
    }

    if (user) {
      return (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() =>
              setOpenMenuPath((prev) => (prev === pathname ? null : pathname))
            }
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
            aria-label="Mở menu tài khoản"
            className="border-border bg-bg-card hover:bg-bg-hover focus-visible:ring-primary flex h-11 cursor-pointer items-center gap-2 rounded-full border p-1 pr-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:h-10"
          >
            <span className="bg-primary-light text-primary flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
              {user.avatarUrl && user.avatarUrl.trim() !== "" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-4 w-4" strokeWidth={1.75} />
              )}
            </span>
            <span className="text-text-primary hidden max-w-[110px] truncate text-sm font-medium sm:inline">
              {user.username}
            </span>
            <ChevronDown
              className={cn(
                "text-text-secondary hidden h-4 w-4 transition-transform duration-150 sm:inline",
                showUserMenu && "rotate-180",
              )}
              strokeWidth={1.75}
            />
          </button>

          {showUserMenu && (
            <div
              role="menu"
              className="border-border bg-bg-card absolute top-13 right-0 z-50 w-56 rounded-2xl border p-1.5 shadow-lg"
            >
              <div className="border-border mb-1 border-b px-3 py-2">
                <p className="text-text-primary truncate text-sm font-semibold">
                  {user.username}
                </p>
                <p className="text-text-secondary truncate text-xs">
                  {user.email}
                </p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpenMenuPath(null);
                  router.push(ROUTES.PROFILE);
                }}
                className="text-text-primary hover:bg-bg-hover flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 text-left text-sm font-medium transition-colors"
              >
                <User
                  className="text-text-secondary h-4 w-4"
                  strokeWidth={1.75}
                />
                Thông tin cá nhân
              </button>

              {user.role === ROLE.ADMIN && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpenMenuPath(null);
                    router.push(ROUTES.ADMIN_DASHBOARD);
                  }}
                  className="text-accent hover:bg-accent-light/60 flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 text-left text-sm font-semibold transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
                  Trang quản trị
                </button>
              )}

              <div className="bg-border my-1 h-px" />

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="text-error hover:bg-error/10 flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 text-left text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={ROUTES.LOGIN}
        className="bg-primary hover:bg-primary-hover focus-visible:ring-primary flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:outline-none sm:h-10"
      >
        Đăng nhập
      </Link>
    );
  };

  return (
    <header className="border-border bg-bg-card/90 sticky top-0 z-40 border-b backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:h-16 sm:px-6">
        <div className="flex items-center">
          <Link
            href={ROUTES.HOME}
            className="focus-visible:ring-primary rounded-xl focus-visible:ring-2 focus-visible:outline-none"
          >
            <BrandLogo size="sm" className="sm:hidden" />
            <BrandLogo size="md" className="hidden sm:inline-flex" />
          </Link>

          <nav
            aria-label="Điều hướng chính"
            className="ml-8 hidden items-center gap-1.5 md:flex"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "focus-visible:ring-primary flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "bg-primary-light text-primary font-semibold"
                      : "text-text-secondary hover:bg-bg-hover hover:text-text-primary font-medium",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {mounted && user?.role === ROLE.ADMIN && (
              <Link
                href={ROUTES.ADMIN_DASHBOARD}
                className="bg-accent-light text-accent focus-visible:ring-primary ml-1 flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
              >
                <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
                <span>Quản trị</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {mounted && user?.role === ROLE.ADMIN && (
            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              aria-label="Trang quản trị"
              title="Trang quản trị"
              className="bg-accent-light text-accent inline-flex h-11 w-11 items-center justify-center rounded-xl transition-opacity hover:opacity-90 md:hidden"
            >
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          )}
          <ThemeToggle />
          {renderUserArea()}
        </div>
      </div>
    </header>
  );
}
