"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Leaf, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (showOtp && countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (countdown === 0) setCanResend(true);
  }, [showOtp, countdown]);

  const handleSendOtp = () => {
    if (!phone.trim()) { setError("Vui lòng nhập số điện thoại"); return; }
    setError("");
    setShowOtp(true);
    setCountdown(60);
    setCanResend(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleConfirmOtp = () => {
    if (otp.join("").length === 6) router.push(ROUTES.LOGIN);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setCountdown(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 py-12 font-[Inter,sans-serif]">
      {/* OTP Modal Overlay */}
      {showOtp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-8 w-full max-w-[400px] text-center">
            <h2 className="text-[20px] font-[600] text-[#1B1B1B] mb-2">Nhập mã OTP</h2>
            <p className="text-[14px] text-[#5C5C5C] mb-6">
              Mã xác nhận đã được gửi đến <span className="font-[500] text-[#1B1B1B]">{phone}</span>
            </p>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-[20px] font-[600] rounded-lg border border-[#E0E0E0] focus:border-[#2F9E44] focus:outline-none transition-colors"
                  maxLength={1}
                />
              ))}
            </div>
            <button
              onClick={handleConfirmOtp}
              disabled={otp.join("").length < 6}
              className="w-full h-12 rounded-lg bg-[#2F9E44] text-white text-[16px] font-[500] hover:bg-[#1F6F2E] transition-colors disabled:bg-[#E0E0E0] disabled:text-[#9E9E9E] cursor-pointer disabled:cursor-not-allowed mb-4"
            >
              Xác nhận
            </button>
            <div className="text-[14px] text-[#5C5C5C]">
              {canResend ? (
                <button onClick={handleResend} className="text-[#2F9E44] font-[500] cursor-pointer">
                  Gửi lại mã
                </button>
              ) : (
                <span>Gửi lại sau <span className="text-[#2F9E44] font-[500]">{countdown}s</span></span>
              )}
            </div>
            <button onClick={() => setShowOtp(false)} className="mt-4 text-[14px] text-[#5C5C5C] hover:text-[#1B1B1B] cursor-pointer">
              Đóng
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[400px] bg-white rounded-xl border border-[#E0E0E0] p-8">
        <button onClick={() => router.push(ROUTES.LOGIN)} className="flex items-center gap-1 text-[14px] text-[#5C5C5C] hover:text-[#1B1B1B] mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
        </button>
        <div className="flex items-center gap-2 mb-6">
          <Leaf className="w-6 h-6 text-[#2F9E44]" />
          <span className="text-[18px] font-[600] text-[#1B1B1B]">Lúa Khoẻ</span>
        </div>
        <h1 className="text-[24px] font-[600] text-[#1B1B1B] mb-1">Quên mật khẩu</h1>
        <p className="text-[14px] text-[#5C5C5C] mb-6">Nhập số điện thoại để nhận mã OTP</p>
        <div>
          <label className="block text-[14px] text-[#1B1B1B] mb-1.5">Số điện thoại</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0901234567"
            className={`w-full h-11 px-3 rounded-lg border ${error ? "border-[#E53935]" : "border-[#E0E0E0]"} bg-white text-[14px] placeholder:text-[#9E9E9E] focus:outline-none focus:border-[#2F9E44]`}
          />
          {error && <p className="text-[12px] text-[#E53935] mt-1">{error}</p>}
        </div>
        <button onClick={handleSendOtp} className="w-full h-12 mt-6 rounded-lg bg-[#2F9E44] text-white text-[16px] font-[500] hover:bg-[#1F6F2E] transition-colors cursor-pointer">
          Gửi OTP
        </button>
      </div>
    </div>
  );
}
