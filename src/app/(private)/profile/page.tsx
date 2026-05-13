"use client";

import { useState } from "react";
import { User, Save, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    name: user?.full_name || "Nguyễn Văn A",
    phone: user?.phone || "0901234567",
    email: user?.email || "nguyenvana@gmail.com",
    province: "An Giang",
  });
  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = "w-full h-11 px-3 rounded-lg border border-[#E0E0E0] bg-white text-[14px] text-[#1B1B1B] placeholder:text-[#9E9E9E] focus:outline-none focus:border-[#2F9E44] transition-colors";

  return (
    <div className="max-w-[600px] mx-auto pb-20">
      <h1 className="text-[28px] font-[700] text-[#1B1B1B] mb-6">Thông tin cá nhân</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center border-2 border-[#2F9E44]">
          <User className="w-8 h-8 text-[#2F9E44]" />
        </div>
        <div>
          <p className="text-[18px] font-[600] text-[#1B1B1B]">{form.name}</p>
          <p className="text-[14px] text-[#5C5C5C]">{user?.role === "admin" ? "Quản trị viên" : "Nông dân"}</p>
        </div>
      </div>

      {/* Info form */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 mb-6">
        <h3 className="text-[18px] font-[600] text-[#1B1B1B] mb-4">Thông tin cơ bản</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[14px] font-[500] text-[#1B1B1B] mb-1.5">Họ và tên</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-[14px] font-[500] text-[#1B1B1B] mb-1.5">Số điện thoại</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-[14px] font-[500] text-[#1B1B1B] mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-[14px] font-[500] text-[#1B1B1B] mb-1.5">Tỉnh / Thành phố</label>
            <input type="text" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className={inputClass} />
          </div>
        </div>
        <button onClick={handleSave} className="mt-6 h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] hover:bg-[#1F6F2E] transition-colors flex items-center gap-2 cursor-pointer">
          <Save className="w-4 h-4" /> {saved ? "Đã lưu!" : "Lưu thay đổi"}
        </button>
      </div>

      {/* Password form */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
        <h3 className="text-[18px] font-[600] text-[#1B1B1B] mb-4">Đổi mật khẩu</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[14px] font-[500] text-[#1B1B1B] mb-1.5">Mật khẩu hiện tại</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={passForm.current} onChange={(e) => setPassForm({ ...passForm, current: e.target.value })} className={`${inputClass} pr-10`} />
              <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5C5C] cursor-pointer">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-[500] text-[#1B1B1B] mb-1.5">Mật khẩu mới</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={passForm.newPass} onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })} className={`${inputClass} pr-10`} />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5C5C] cursor-pointer">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-[500] text-[#1B1B1B] mb-1.5">Xác nhận mật khẩu mới</label>
            <input type="password" value={passForm.confirm} onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })} className={inputClass} />
          </div>
        </div>
        <button onClick={handleSave} className="mt-6 h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] hover:bg-[#1F6F2E] transition-colors flex items-center gap-2 cursor-pointer">
          <Save className="w-4 h-4" /> Đổi mật khẩu
        </button>
      </div>
    </div>
  );
}
