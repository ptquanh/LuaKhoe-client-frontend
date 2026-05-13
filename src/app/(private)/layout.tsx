"use client";

import { usePathname, useRouter } from "next/navigation";
import { Leaf, Search, Bell, User, Stethoscope, History } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    {
      path: "/diagnose",
      label: "Chẩn đoán",
      icon: <Stethoscope className="h-4 w-4" />,
    },
    {
      path: "/history",
      label: "Lịch sử",
      icon: <History className="h-4 w-4" />,
    },
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
      <header className="sticky top-0 z-50 flex h-[72px] items-center border-b border-[#E0E0E0] bg-white px-6">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => router.push("/")}
        >
          <Leaf className="h-6 w-6 text-[#2F9E44]" />
          <span className="text-[18px] font-[600] text-[#1B1B1B]">
            Lúa Khoẻ
          </span>
        </div>

        <nav className="ml-8 flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex h-10 cursor-pointer items-center gap-2 rounded-lg px-4 text-[14px] transition-colors ${
                isActive(item.path)
                  ? "bg-[#E6F4EA] font-[500] text-[#1F6F2E]"
                  : "text-[#5C5C5C] hover:bg-[#F0F2F5]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#5C5C5C] hover:bg-[#F0F2F5]">
            <Search className="h-5 w-5" />
          </button>
          <button className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#5C5C5C] hover:bg-[#F0F2F5]">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E53935]" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E0E0E0] bg-[#E6F4EA] text-[#2F9E44]"
            >
              <User className="h-4 w-4" />
            </button>
            {showUserMenu && (
              <div className="absolute top-10 right-0 z-50 w-48 rounded-lg border border-[#E0E0E0] bg-white py-1 shadow-lg">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setShowUserMenu(false);
                  }}
                  className="w-full cursor-pointer px-4 py-2.5 text-left text-[14px] text-[#1B1B1B] hover:bg-[#F0F2F5]"
                >
                  Thông tin cá nhân
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full cursor-pointer px-4 py-2.5 text-left text-[14px] text-[#E53935] hover:bg-[#F0F2F5]"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-6">{children}</main>
    </div>
  );
}
