"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Users,
  Bug,
  FileText,
  Brain,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

const menuItems = [
  { label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "Người dùng", href: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Bệnh lúa", href: ROUTES.ADMIN_DISEASES, icon: Bug },
  { label: "Tài liệu RAG", href: ROUTES.ADMIN_DOCUMENTS, icon: FileText },
  { label: "Mô hình", href: ROUTES.ADMIN_MODELS, icon: Brain },
  { label: "Phản hồi AI", href: ROUTES.ADMIN_FEEDBACK, icon: MessageSquare },
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
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
          <div className="ml-auto flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F4EA]">
              <span className="text-[12px] font-[600] text-[#2F9E44]">A</span>
            </div>
            <span className="hidden text-[14px] font-[500] text-[#1B1B1B] sm:block">
              Admin
            </span>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
