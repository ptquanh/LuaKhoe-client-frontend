"use client";

import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { ArrowRight, Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes";
import { getErrorMessage, useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";

function PasswordRequirements({ password }: { password?: string }) {
  const val = password || "";
  const requirements = [
    { label: "Tối thiểu 8 ký tự", valid: val.length >= 8 },
    { label: "Ít nhất 1 chữ in hoa (A-Z)", valid: /[A-Z]/.test(val) },
    { label: "Ít nhất 1 chữ viết thường (a-z)", valid: /[a-z]/.test(val) },
    {
      label: "Ít nhất 1 ký tự đặc biệt (ví dụ: @, $, !, %, *, ?, &)",
      valid: /[\W_]/.test(val),
    },
  ];

  return (
    <div className="mt-2.5 space-y-1.5 text-[13px]">
      {requirements.map((req, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-1.5 font-[500] ${
            req.valid
              ? "text-green-600"
              : val
                ? "text-red-500"
                : "text-gray-400"
          }`}
        >
          {req.valid ? (
            <Check className="h-4 w-4 shrink-0 text-green-600" />
          ) : (
            <X
              className={`h-4 w-4 shrink-0 ${val ? "text-red-500" : "text-gray-400"}`}
            />
          )}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPasswordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Evaluate password conditions
  const isLengthValid = password.length >= 8;
  const isUpperValid = /[A-Z]/.test(password);
  const isLowerValid = /[a-z]/.test(password);
  const isSpecialValid = /[\W_]/.test(password);
  const areAllRequirementsMet =
    isLengthValid && isUpperValid && isLowerValid && isSpecialValid;
  const passwordsMatch = password === confirmPassword;

  // Redirect if not logged in or already has password
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push(ROUTES.LOGIN);
      } else if (user.hasPassword) {
        router.push(ROUTES.ONBOARDING_LOCATION);
      }
    }
  }, [user, isAuthLoading, router]);

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!areAllRequirementsMet) {
      setPasswordError("Mật khẩu chưa đáp ứng đầy đủ các yêu cầu bảo mật.");
      return;
    }

    if (!passwordsMatch) {
      setPasswordError("Xác nhận mật khẩu không trùng khớp.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await authService.changePassword({ newPassword: password });
      if (res.success) {
        message.success("Thiết lập mật khẩu tài khoản thành công!");

        // Set flag to indicate they came from the 2-step Google flow
        if (typeof window !== "undefined") {
          sessionStorage.setItem("completed_password_step", "true");
        }

        // Update query data synchronously to prevent stale redirect loop
        queryClient.setQueryData(["auth-me"], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              hasPassword: true,
            };
          }
          return oldData;
        });
        // Invalidate "auth-me" query to refresh user.hasPassword state reactively in the background
        await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
        router.push(ROUTES.ONBOARDING_LOCATION);
      } else {
        setPasswordError(getErrorMessage(res));
      }
    } catch (err: any) {
      setPasswordError(getErrorMessage(err));
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isAuthLoading || !user || user.hasPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2F9E44]" />
          <p className="mt-2 text-[14px] text-[#5C5C5C]">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F6F8] px-4 py-8 font-[Inter,sans-serif]">
      <div className="w-full max-w-[500px] rounded-2xl border border-gray-200/50 bg-white p-6 shadow-xl transition-all md:p-8">
        {/* Progress header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-[16px] font-[700] text-[#1F6F2E]">
              Lúa Khoẻ Onboarding
            </span>
          </div>
          <span className="rounded-full bg-[#FFF3E0] px-2.5 py-0.5 text-[11px] font-[600] text-[#E65100]">
            Bước 1 / 2
          </span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-[24px] font-[700] tracking-tight text-[#1B1B1B]">
            Thiết lập mật khẩu tài khoản
          </h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#5C5C5C]">
            Tài khoản của bạn hiện chưa có mật khẩu (đăng nhập qua Google). Vui
            lòng thiết lập mật khẩu mới để bảo mật tài khoản tốt hơn và có thể
            đăng nhập trực tiếp.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSavePassword} className="space-y-4">
          {passwordError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13.5px] font-[500] text-red-800">
              {passwordError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-[600] text-[#5C5C5C]">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="h-11 w-full rounded-xl border border-gray-300 pr-10 pl-4 text-[14.5px] outline-none focus:border-[#2F9E44]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-none bg-transparent text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {/* Password requirements checker */}
            <PasswordRequirements password={password} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-[600] text-[#5C5C5C]">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="h-11 w-full rounded-xl border border-gray-300 pr-16 pl-4 text-[14.5px] outline-none focus:border-[#2F9E44]"
                required
              />
              <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
                {confirmPassword &&
                  (passwordsMatch ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  ))}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer border-none bg-transparent p-0 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={
                isSavingPassword || !areAllRequirementsMet || !passwordsMatch
              }
              className="flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#2F9E44] px-6 text-[14px] font-[600] text-white transition-all hover:bg-[#1F6F2E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Lưu & Tiếp tục
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
