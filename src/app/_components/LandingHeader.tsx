"use client";

import { ArrowRight, Menu, ScanLine, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

const NAV_LINKS = [
  { id: "features", href: "#features", label: "Tính năng" },
  { id: "how-it-works", href: "#how-it-works", label: "Quy trình" },
  { id: "diseases", href: "#diseases", label: "Bệnh phổ biến" },
  { id: "faq", href: "#faq", label: "Hỏi đáp" },
];

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isScrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );
  const { user } = useAuth();

  useEffect(() => {
    const sections = NAV_LINKS.map((item) =>
      document.getElementById(item.id),
    ).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((e) => e.isIntersecting);
        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0.05 },
    );

    sections.forEach((sec) => obs.observe(sec));
    return () => obs.disconnect();
  }, []);

  const isAuthenticated = mounted && Boolean(user);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
          isScrolled ? "sm:px-4 sm:pt-3" : "px-0 pt-0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-300",
            isScrolled
              ? "border-border/80 bg-bg-card/88 h-15 max-w-[1200px] border-b px-4 shadow-lg shadow-black/5 backdrop-blur-xl sm:h-16 sm:rounded-2xl sm:border sm:px-5"
              : "h-16 max-w-[1240px] bg-gradient-to-b from-black/60 via-black/30 to-transparent px-4 sm:h-[76px] sm:px-6",
          )}
        >
          {/* Left: Brand */}
          <Link
            href={ROUTES.HOME}
            onClick={() => setMobileMenuOpen(false)}
            className="focus-visible:ring-primary rounded-xl focus-visible:ring-2 focus-visible:outline-none"
          >
            <BrandLogo size="sm" inverted={!isScrolled} className="sm:hidden" />
            <BrandLogo
              size="md"
              inverted={!isScrolled}
              className="hidden sm:inline-flex"
            />
          </Link>

          {/* Center: Floating Pill Nav */}
          <nav
            aria-label="Điều hướng trang chủ"
            className={cn(
              "hidden items-center gap-1 rounded-full border p-1 backdrop-blur-md transition-colors md:flex",
              isScrolled
                ? "border-border/70 bg-bg-subtle/80"
                : "border-white/15 bg-white/10",
            )}
          >
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                    isScrolled
                      ? isActive
                        ? "bg-bg-card text-primary font-semibold shadow-xs"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-card/60"
                      : isActive
                        ? "bg-white/22 font-semibold text-white shadow-xs"
                        : "text-white/85 hover:bg-white/12 hover:text-white",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Theme + Auth CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle
              className={cn(
                !isScrolled &&
                  "border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white",
              )}
            />

            <div className="hidden items-center gap-2 md:flex">
              {isAuthenticated && user ? (
                <>
                  <Link
                    href={ROUTES.PROFILE}
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-full border px-2.5 pr-3.5 text-sm font-medium transition-colors",
                      isScrolled
                        ? "border-border bg-bg-subtle/70 text-text-primary hover:bg-bg-hover"
                        : "border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
                    )}
                  >
                    <span className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="max-w-[100px] truncate">
                      {user.username}
                    </span>
                  </Link>
                  <Link
                    href={ROUTES.DIAGNOSE}
                    className="bg-primary hover:bg-primary-hover flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white shadow-sm transition-colors"
                  >
                    <ScanLine className="h-4 w-4" />
                    <span>Vào chẩn đoán</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    className={cn(
                      "flex h-10 items-center rounded-full px-3.5 text-sm font-semibold transition-colors",
                      isScrolled
                        ? "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                        : "text-white/90 hover:bg-white/12 hover:text-white",
                    )}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    className="bg-primary hover:bg-primary-hover flex h-10 items-center gap-1.5 rounded-full px-4.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
                  >
                    <span>Bắt đầu miễn phí</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileMenuOpen}
              className={cn(
                "flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border transition-colors md:hidden",
                isScrolled
                  ? "border-border bg-bg-card text-text-primary hover:bg-bg-hover"
                  : "border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
              )}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-border bg-bg-card animate-in slide-in-from-top-2 mx-3 mt-2 rounded-2xl border p-4 shadow-xl md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center justify-between rounded-xl px-3.5 text-sm font-medium transition-colors",
                    activeSection === item.id
                      ? "bg-primary-soft text-primary font-semibold"
                      : "text-text-primary hover:bg-bg-hover",
                  )}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="text-text-muted h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="border-border mt-3 grid grid-cols-2 gap-2.5 border-t pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href={ROUTES.PROFILE}
                    onClick={() => setMobileMenuOpen(false)}
                    className="border-border text-text-primary hover:bg-bg-hover flex min-h-11 items-center justify-center rounded-xl border text-sm font-semibold"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    href={ROUTES.DIAGNOSE}
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-primary hover:bg-primary-hover flex min-h-11 items-center justify-center rounded-xl text-sm font-semibold text-white"
                  >
                    Chẩn đoán ngay
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    onClick={() => setMobileMenuOpen(false)}
                    className="border-border text-text-primary hover:bg-bg-hover flex min-h-11 items-center justify-center rounded-xl border text-sm font-semibold"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-primary hover:bg-primary-hover flex min-h-11 items-center justify-center rounded-xl text-sm font-semibold text-white"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Scrim */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Đóng menu điều hướng"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}
