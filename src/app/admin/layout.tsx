"use client";

import {
  Brain,
  Bug,
  CheckSquare,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ROLE } from "@/types/auth.type";

const menuItems = [
  { label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "Người dùng", href: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Bệnh lúa", href: ROUTES.ADMIN_DISEASES, icon: Bug },
  {
    label: "Cơ sở tri thức dinh dưỡng",
    href: ROUTES.ADMIN_DOCUMENTS,
    icon: FileText,
  },
  { label: "Mô hình", href: ROUTES.ADMIN_MODELS, icon: Brain },
  { label: "Phản hồi AI", href: ROUTES.ADMIN_FEEDBACK, icon: MessageSquare },
  { label: "Quản lý Diễn đàn", href: ROUTES.ADMIN_FORUM, icon: CheckSquare },
  { label: "Cấu hình", href: ROUTES.ADMIN_CONFIGS, icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(ROUTES.LOGIN);
      } else if (user.role !== ROLE.ADMIN) {
        router.push(ROUTES.DIAGNOSE);
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-16 items-center border-b px-5">
        <BrandLogo size="sm" subtitle="Admin" />
      </div>
      <nav
        aria-label="Menu quản trị"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-3"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-light text-primary font-semibold"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-border border-t px-3 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className="text-error hover:bg-error/10 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-bg-page flex min-h-screen items-center justify-center">
        <div className="text-text-secondary animate-pulse text-[15px] font-medium">
          Đang xác thực quyền truy cập...
        </div>
      </div>
    );
  }

  if (!user || user.role !== ROLE.ADMIN) {
    return null;
  }

  return (
    <div className="bg-bg-page text-text-primary flex min-h-screen transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="border-border bg-bg-card fixed z-30 hidden h-full w-[260px] flex-col border-r lg:flex">
        {sidebar}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="bg-bg-card relative h-full w-[272px] max-w-[85vw] shadow-xl">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Đóng menu điều hướng"
              className="hover:bg-bg-hover absolute top-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors"
            >
              <X className="text-text-secondary h-5 w-5" strokeWidth={1.75} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[260px]">
        <header className="border-border bg-bg-card/90 sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu quản trị"
            className="hover:bg-bg-hover flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors lg:hidden"
          >
            <Menu className="text-text-secondary h-5 w-5" strokeWidth={1.75} />
          </button>

          <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
            <Link
              href={ROUTES.DIAGNOSE}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border bg-bg-card text-primary hover:bg-primary-light/60 flex h-10 items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold shadow-xs transition-colors"
            >
              <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span className="sm:hidden">Giao diện ND</span>
              <span className="hidden sm:inline">Xem giao diện Nông dân</span>
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="bg-primary-light flex h-9 w-9 items-center justify-center rounded-full">
                <span className="text-primary text-xs font-bold">
                  {(user?.username || "A").charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-text-primary hidden text-sm font-medium sm:block">
                {user?.username || "Admin"}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
