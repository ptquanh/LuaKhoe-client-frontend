"use client";

import { Alert, Button, Form, Input, message, Typography } from "antd";
import { Clock, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { VERIFY_OTP_ACTION } from "@/types/auth.type";

const { Title, Text } = Typography;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendEmail, isLoading, error, setError } = useAuth();
  const [form] = Form.useForm();

  const email = searchParams.get("email") || "";
  const actionParam = searchParams.get("action");
  const action =
    actionParam === "REGISTER"
      ? VERIFY_OTP_ACTION.REGISTER
      : VERIFY_OTP_ACTION.REGISTER;

  const [countdown, setCountdown] = useState(60);
  const [otpExpiry, setOtpExpiry] = useState(600);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (otpExpiry <= 0) return;
    const timer = setTimeout(() => {
      setOtpExpiry((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [otpExpiry]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const onFinish = async (values: { otp: string }) => {
    if (!email) {
      setError("Không tìm thấy thông tin email. Vui lòng đăng ký lại.");
      return;
    }

    if (otpExpiry <= 0) {
      setError("Mã OTP đã hết hạn. Vui lòng bấm gửi lại mã OTP mới.");
      return;
    }

    await verifyOtp(
      {
        usernameOrEmail: email,
        code: values.otp,
        action,
      },
      () => {
        message.success(
          "Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay.",
        );
        router.push(ROUTES.LOGIN);
      },
    );
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setError(null);
    try {
      await resendEmail({ email }, () => {
        message.success("Mã OTP mới đã được gửi tới email của bạn.");
        setCountdown(60);
        setOtpExpiry(600);
      });
    } catch {
      // Handled in useAuth hook
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="bg-bg-page relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="border-border bg-bg-card w-full max-w-[480px] rounded-2xl border p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex justify-center">
          <Link href={ROUTES.HOME}>
            <BrandLogo size="md" />
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="bg-primary-light text-primary mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
            <KeyRound className="h-7 w-7" />
          </div>
          <Title level={2} className="font-heading text-text-primary! mb-2!">
            Xác thực OTP
          </Title>
          <Text className="text-text-secondary!">
            Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email:
          </Text>
          <div className="text-text-primary mt-1 font-semibold">
            {email || "chưa xác định"}
          </div>
        </div>

        {/* Countdown Expiry */}
        <div className="border-warning/35 bg-accent-light/50 text-accent mb-6 flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3">
          <Clock className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">
            {otpExpiry > 0 ? (
              <>
                Mã xác thực sẽ hết hạn sau:{" "}
                <span className="font-mono text-base font-bold tabular-nums">
                  {formatTime(otpExpiry)}
                </span>
              </>
            ) : (
              <span className="text-error font-semibold">
                Mã xác thực đã hết hạn. Vui lòng gửi lại mã!
              </span>
            )}
          </span>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-6 rounded-xl font-medium"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="w-full"
        >
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: "Vui lòng nhập mã OTP" },
              { len: 6, message: "Mã OTP phải có đúng 6 ký tự" },
            ]}
            className="mb-6 flex justify-center"
          >
            <Input.OTP length={6} className="gap-2" />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="h-12 rounded-xl text-base font-semibold shadow-xs"
            >
              Xác nhận kích hoạt
            </Button>
          </Form.Item>

          <div className="mt-6 text-center">
            {countdown > 0 ? (
              <Text className="text-text-secondary!">
                Gửi lại mã sau{" "}
                <span className="text-primary font-semibold tabular-nums">
                  {countdown}s
                </span>
              </Text>
            ) : (
              <Button
                type="link"
                onClick={handleResend}
                loading={isResending}
                className="text-primary! hover:text-primary-hover! p-0 font-semibold"
              >
                Gửi lại mã OTP
              </Button>
            )}
          </div>

          <div className="border-border mt-8 border-t pt-6 text-center">
            <Link
              href={ROUTES.REGISTER}
              className="text-text-secondary hover:text-text-primary text-sm font-medium"
            >
              Quay lại Đăng ký
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-page flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
            <p className="text-text-secondary mt-2 text-sm font-medium">
              Đang tải...
            </p>
          </div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
