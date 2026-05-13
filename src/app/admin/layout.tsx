"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf, LayoutDashboard, Users, Bug, FileText,
  Brain, MessageSquare, Settings, LogOut, Menu, X,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

const menuItems = [
  { label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "Người dùng", href: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Bệnh lúa", href: ROUTES.ADMIN_DISEASES, icon: Bug },
  { label: "Tài liệu RAG", href: ROUTES.ADMIN_DOCUMENTS, icon: FileText },
  { label: "AI Models", href: ROUTES.ADMIN_MODELS, icon: Brain },
  { label: "Phản hồi AI", href: ROUTES.ADMIN_FEEDBACK, icon: MessageSquare },
  { label: "Cấu hình", href: ROUTES.ADMIN_CONFIGS, icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push(ROUTES.LOGIN);
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-[#E0E0E0]">
        <Leaf className="w-6 h-6 text-[#2F9E44]" />
        <span className="text-[16px] font-[700] text-[#1B1B1B]">Lúa Khoẻ Admin</span>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] font-[500] transition-colors ${
                active
                  ? "bg-[#E6F4EA] text-[#2F9E44]"
                  : "text-[#5C5C5C] hover:bg-[#F0F2F5] hover:text-[#1B1B1B]"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-[#E0E0E0]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] text-[#E53935] hover:bg-[#FFEBEE] transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F7F7F7] font-[Inter,sans-serif]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-[#E0E0E0] fixed h-full z-30">
        {sidebar}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-[260px] bg-white h-full shadow-xl">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center cursor-pointer">
              <X className="w-5 h-5 text-[#5C5C5C]" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-[#E0E0E0] px-6 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-lg hover:bg-[#F0F2F5] flex items-center justify-center cursor-pointer">
            <Menu className="w-5 h-5 text-[#5C5C5C]" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center">
              <span className="text-[12px] font-[600] text-[#2F9E44]">A</span>
            </div>
            <span className="text-[14px] font-[500] text-[#1B1B1B] hidden sm:block">Admin</span>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
