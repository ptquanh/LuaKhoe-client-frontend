"use client";

import { usePathname, useRouter } from "next/navigation";
import { Leaf, Search, Bell, User, Stethoscope, History } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: "/diagnose", label: "Chẩn đoán", icon: <Stethoscope className="w-4 h-4" /> },
    { path: "/history", label: "Lịch sử", icon: <History className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] font-[Inter,sans-serif]">
      {/* Header 72px */}
      <header className="h-[72px] bg-white border-b border-[#E0E0E0] flex items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <Leaf className="w-6 h-6 text-[#2F9E44]" />
          <span className="text-[18px] font-[600] text-[#1B1B1B]">Lúa Khoẻ</span>
        </div>

        <nav className="flex items-center gap-1 ml-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`h-10 px-4 rounded-lg flex items-center gap-2 text-[14px] transition-colors cursor-pointer ${
                isActive(item.path)
                  ? "bg-[#E6F4EA] text-[#1F6F2E] font-[500]"
                  : "text-[#5C5C5C] hover:bg-[#F0F2F5]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button className="w-10 h-10 rounded-lg hover:bg-[#F0F2F5] flex items-center justify-center text-[#5C5C5C] cursor-pointer">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative w-10 h-10 rounded-lg hover:bg-[#F0F2F5] flex items-center justify-center text-[#5C5C5C] cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#E53935] rounded-full" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#2F9E44] cursor-pointer border border-[#E0E0E0]"
            >
              <User className="w-4 h-4" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-lg border border-[#E0E0E0] shadow-lg py-1 z-50">
                <button onClick={() => { router.push("/profile"); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-[14px] text-[#1B1B1B] hover:bg-[#F0F2F5] cursor-pointer">
                  Thông tin cá nhân
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-[14px] text-[#E53935] hover:bg-[#F0F2F5] cursor-pointer">
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
