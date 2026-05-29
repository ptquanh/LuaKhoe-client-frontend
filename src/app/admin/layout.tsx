"use client";

import {
  Brain,
  Bug,
  CheckSquare,
  FileText,
  LayoutDashboard,
  Leaf,
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

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
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

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-[#E0E0E0] px-5">
        <Leaf className="h-6 w-6 text-[#2F9E44]" />
        <span className="text-[16px] font-[700] text-[#1B1B1B]">
          Lúa Khoẻ Admin
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[14px] font-[500] transition-colors ${
                active
                  ? "bg-[#E6F4EA] text-[#2F9E44]"
                  : "text-[#5C5C5C] hover:bg-[#F0F2F5] hover:text-[#1B1B1B]"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#E0E0E0] px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-[14px] text-[#E53935] transition-colors hover:bg-[#FFEBEE]"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] font-[Inter,sans-serif]">
        <div className="animate-pulse text-[15px] font-[500] text-[#5C5C5C]">
          Đang xác thực quyền truy cập...
        </div>
      </div>
    );
  }

  if (!user || user.role !== ROLE.ADMIN) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F7F7F7] font-[Inter,sans-serif]">
      {/* Desktop Sidebar */}
      <aside className="fixed z-30 hidden h-full w-[260px] flex-col border-r border-[#E0E0E0] bg-white lg:flex">
        {sidebar}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative h-full w-[260px] bg-white shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-[#F0F2F5]"
            >
              <X className="h-5 w-5 text-[#5C5C5C]" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E0E0E0] bg-white px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg hover:bg-[#F0F2F5] lg:hidden"
          >
            <Menu className="h-5 w-5 text-[#5C5C5C]" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href={ROUTES.DIAGNOSE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-[#E0E0E0] bg-white px-3 py-1.5 text-[13px] font-[600] text-[#2F9E44] shadow-xs transition-colors hover:bg-[#E6F4EA]/50 hover:text-[#1F6F2E]"
            >
              <span>👀 Xem giao diện Nông dân</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F4EA]">
                <span className="text-[12px] font-[600] text-[#2F9E44]">
                  {(user?.username || "A").charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden text-[14px] font-[500] text-[#1B1B1B] sm:block">
                {user?.username || "Admin"}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
