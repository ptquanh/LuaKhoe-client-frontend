"use client";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  ShieldOff,
} from "lucide-react";
import { useState } from "react";

interface UserItem {
  id: number;
  name: string;
  phone: string;
  province: string;
  uploads: number;
  joinDate: string;
  banned: boolean;
}

const mockUsers: UserItem[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    province: "An Giang",
    uploads: 45,
    joinDate: "01/01/2026",
    banned: false,
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    province: "Đồng Tháp",
    uploads: 32,
    joinDate: "15/01/2026",
    banned: false,
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    province: "Cần Thơ",
    uploads: 28,
    joinDate: "01/02/2026",
    banned: false,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0934567890",
    province: "Kiên Giang",
    uploads: 21,
    joinDate: "10/02/2026",
    banned: true,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    phone: "0945678901",
    province: "Long An",
    uploads: 19,
    joinDate: "15/02/2026",
    banned: false,
  },
  {
    id: 6,
    name: "Vũ Thị F",
    phone: "0956789012",
    province: "Tiền Giang",
    uploads: 15,
    joinDate: "20/02/2026",
    banned: false,
  },
  {
    id: 7,
    name: "Đặng Văn G",
    phone: "0967890123",
    province: "Bến Tre",
    uploads: 12,
    joinDate: "25/02/2026",
    banned: false,
  },
  {
    id: 8,
    name: "Bùi Thị H",
    phone: "0978901234",
    province: "Sóc Trăng",
    uploads: 9,
    joinDate: "01/03/2026",
    banned: false,
  },
];

const PAGE_SIZE = 5;

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleBan = (id: number) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, banned: !u.banned } : u)),
    );

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            Quản lý Người dùng
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            {filtered.length} người dùng
          </p>
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm tên hoặc SĐT..."
            className="h-10 w-[240px] rounded-lg border border-[#E0E0E0] pr-4 pl-10 text-[14px] focus:border-[#2F9E44] focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F2F5]">
              <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Họ tên
              </th>
              <th className="hidden h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                SĐT
              </th>
              <th className="hidden h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B] lg:table-cell">
                Tỉnh/TP
              </th>
              <th className="h-12 w-20 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Upload
              </th>
              <th className="hidden h-12 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Ngày tham gia
              </th>
              <th className="h-12 w-24 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Trạng thái
              </th>
              <th className="h-12 w-24 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map((u, i) => (
              <tr
                key={u.id}
                className={`h-12 border-t border-[#E0E0E0] hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
              >
                <td className="px-4 text-[14px] font-[500] text-[#1B1B1B]">
                  {u.name}
                </td>
                <td className="hidden px-4 text-[14px] text-[#5C5C5C] md:table-cell">
                  {u.phone}
                </td>
                <td className="hidden px-4 text-[14px] text-[#5C5C5C] lg:table-cell">
                  {u.province}
                </td>
                <td className="px-4 text-center text-[14px] text-[#1B1B1B]">
                  {u.uploads}
                </td>
                <td className="hidden px-4 text-center text-[14px] text-[#5C5C5C] md:table-cell">
                  {u.joinDate}
                </td>
                <td className="px-4 text-center">
                  <span
                    className={`inline-block h-5 rounded px-2 text-[11px] leading-[20px] font-[500] ${u.banned ? "bg-[#FFEBEE] text-[#C62828]" : "bg-[#E6F4EA] text-[#2E7D32]"}`}
                  >
                    {u.banned ? "Bị khóa" : "Hoạt động"}
                  </span>
                </td>
                <td className="px-4 text-center">
                  <button
                    onClick={() => toggleBan(u.id)}
                    className={`mx-auto flex h-8 cursor-pointer items-center gap-1 rounded-md px-2.5 text-[12px] font-[500] transition-colors ${u.banned ? "text-[#2E7D32] hover:bg-[#E6F4EA]" : "text-[#E53935] hover:bg-[#FFEBEE]"}`}
                  >
                    {u.banned ? (
                      <Shield className="h-3.5 w-3.5" />
                    ) : (
                      <ShieldOff className="h-3.5 w-3.5" />
                    )}
                    {u.banned ? "Mở" : "Khóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[12px] text-[#5C5C5C]">
          Hiển thị {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 cursor-pointer rounded-md text-[14px] font-[500] ${p === page ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
