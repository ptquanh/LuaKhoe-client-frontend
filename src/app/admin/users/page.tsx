"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Shield, ShieldOff } from "lucide-react";

interface UserItem { id: number; name: string; phone: string; province: string; uploads: number; joinDate: string; banned: boolean; }

const mockUsers: UserItem[] = [
  { id: 1, name: "Nguyễn Văn A", phone: "0901234567", province: "An Giang", uploads: 45, joinDate: "01/01/2026", banned: false },
  { id: 2, name: "Trần Thị B", phone: "0912345678", province: "Đồng Tháp", uploads: 32, joinDate: "15/01/2026", banned: false },
  { id: 3, name: "Lê Văn C", phone: "0923456789", province: "Cần Thơ", uploads: 28, joinDate: "01/02/2026", banned: false },
  { id: 4, name: "Phạm Thị D", phone: "0934567890", province: "Kiên Giang", uploads: 21, joinDate: "10/02/2026", banned: true },
  { id: 5, name: "Hoàng Văn E", phone: "0945678901", province: "Long An", uploads: 19, joinDate: "15/02/2026", banned: false },
  { id: 6, name: "Vũ Thị F", phone: "0956789012", province: "Tiền Giang", uploads: 15, joinDate: "20/02/2026", banned: false },
  { id: 7, name: "Đặng Văn G", phone: "0967890123", province: "Bến Tre", uploads: 12, joinDate: "25/02/2026", banned: false },
  { id: 8, name: "Bùi Thị H", phone: "0978901234", province: "Sóc Trăng", uploads: 9, joinDate: "01/03/2026", banned: false },
];

const PAGE_SIZE = 5;

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleBan = (id: number) => setUsers(prev => prev.map(u => u.id === id ? { ...u, banned: !u.banned } : u));

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">Quản lý Người dùng</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">{filtered.length} người dùng</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm tên hoặc SĐT..." className="h-10 pl-10 pr-4 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44] w-[240px]" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F0F2F5]">
            <th className="text-left px-4 h-12 text-[13px] font-[600] text-[#1B1B1B]">Họ tên</th>
            <th className="text-left px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell">SĐT</th>
            <th className="text-left px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden lg:table-cell">Tỉnh/TP</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] w-20">Upload</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell">Ngày tham gia</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] w-24">Trạng thái</th>
            <th className="text-center px-4 h-12 text-[13px] font-[600] text-[#1B1B1B] w-24">Thao tác</th>
          </tr></thead>
          <tbody>
            {paged.map((u, i) => (
              <tr key={u.id} className={`border-t border-[#E0E0E0] h-12 hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}>
                <td className="px-4 text-[14px] font-[500] text-[#1B1B1B]">{u.name}</td>
                <td className="px-4 text-[14px] text-[#5C5C5C] hidden md:table-cell">{u.phone}</td>
                <td className="px-4 text-[14px] text-[#5C5C5C] hidden lg:table-cell">{u.province}</td>
                <td className="px-4 text-[14px] text-[#1B1B1B] text-center">{u.uploads}</td>
                <td className="px-4 text-[14px] text-[#5C5C5C] text-center hidden md:table-cell">{u.joinDate}</td>
                <td className="px-4 text-center">
                  <span className={`inline-block h-5 px-2 rounded text-[11px] font-[500] leading-[20px] ${u.banned ? "bg-[#FFEBEE] text-[#C62828]" : "bg-[#E6F4EA] text-[#2E7D32]"}`}>
                    {u.banned ? "Bị khóa" : "Hoạt động"}
                  </span>
                </td>
                <td className="px-4 text-center">
                  <button onClick={() => toggleBan(u.id)} className={`h-8 px-2.5 rounded-md text-[12px] font-[500] flex items-center gap-1 mx-auto cursor-pointer transition-colors ${u.banned ? "text-[#2E7D32] hover:bg-[#E6F4EA]" : "text-[#E53935] hover:bg-[#FFEBEE]"}`}>
                    {u.banned ? <Shield className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                    {u.banned ? "Mở" : "Khóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-[12px] text-[#5C5C5C]">Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}</p>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-8 w-8 rounded-md border border-[#E0E0E0] flex items-center justify-center text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 rounded-md text-[14px] font-[500] cursor-pointer ${p === page ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-8 w-8 rounded-md border border-[#E0E0E0] flex items-center justify-center text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
