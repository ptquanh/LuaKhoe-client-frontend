"use client";

import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { ArrowRight, Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
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
          className={`flex items-center gap-1.5 font-medium ${
            req.valid ? "text-success" : val ? "text-error" : "text-text-muted"
          }`}
        >
          {req.valid ? (
            <Check className="text-success h-4 w-4 shrink-0" />
          ) : (
            <X
              className={`h-4 w-4 shrink-0 ${val ? "text-error" : "text-text-muted"}`}
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

  const isLengthValid = password.length >= 8;
  const isUpperValid = /[A-Z]/.test(password);
  const isLowerValid = /[a-z]/.test(password);
  const isSpecialValid = /[\W_]/.test(password);
  const areAllRequirementsMet =
    isLengthValid && isUpperValid && isLowerValid && isSpecialValid;
  const passwordsMatch = password === confirmPassword;

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

        if (typeof window !== "undefined") {
          sessionStorage.setItem("completed_password_step", "true");
        }

        queryClient.setQueryData(["auth-me"], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              hasPassword: true,
            };
          }
          return oldData;
        });
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
      <div className="bg-bg-page flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
          <p className="text-text-secondary mt-2 text-sm">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-bg-page flex min-h-screen items-center justify-center px-4 py-10">
      <div className="border-border bg-bg-card w-full max-w-[500px] rounded-2xl border p-5 shadow-md transition-all sm:p-8">
        {/* Progress header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <BrandLogo size="sm" subtitle="Onboarding" />
          <div className="flex items-center gap-2">
            <span className="bg-accent-light text-accent rounded-full px-3 py-1 text-xs font-semibold tabular-nums">
              Bước 1 / 2
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="font-heading text-text-primary text-2xl font-bold tracking-tight">
            Thiết lập mật khẩu tài khoản
          </h2>
          <p className="text-text-secondary mt-1.5 text-sm leading-relaxed">
            Tài khoản của bạn hiện chưa có mật khẩu (đăng nhập qua Google). Vui
            lòng thiết lập mật khẩu mới để bảo mật tài khoản tốt hơn và có thể
            đăng nhập trực tiếp.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSavePassword} className="space-y-4">
          {passwordError && (
            <div className="border-error/30 bg-error/10 text-error rounded-xl border p-3.5 text-sm font-medium">
              {passwordError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-text-primary text-sm font-semibold">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="border-border bg-bg-card text-text-primary placeholder:text-text-muted focus:border-primary h-12 w-full rounded-xl border pr-11 pl-4 text-base outline-none sm:h-11 sm:text-sm"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-primary absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <PasswordRequirements password={password} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-primary text-sm font-semibold">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="border-border bg-bg-card text-text-primary placeholder:text-text-muted focus:border-primary h-12 w-full rounded-xl border pr-16 pl-4 text-base outline-none sm:h-11 sm:text-sm"
                required
              />
              <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                {confirmPassword &&
                  (passwordsMatch ? (
                    <Check className="text-success h-5 w-5" />
                  ) : (
                    <X className="text-error h-5 w-5" />
                  ))}
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-text-muted hover:text-text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent"
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

          <div className="border-border flex justify-end border-t pt-4">
            <button
              type="submit"
              disabled={
                isSavingPassword || !areAllRequirementsMet || !passwordsMatch
              }
              className="bg-primary hover:bg-primary-hover flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl px-6 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
