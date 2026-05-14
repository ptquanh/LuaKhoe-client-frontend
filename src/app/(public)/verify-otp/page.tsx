"use client";

import { Alert, Button, Form, Input, message, Typography } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
    actionParam === "register"
      ? VERIFY_OTP_ACTION.REGISTER
      : VERIFY_OTP_ACTION.REGISTER;

  const [countdown, setCountdown] = useState(60);
  const [otpExpiry, setOtpExpiry] = useState(600); // 10 minutes in seconds
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Countdown for OTP Expiration
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
        setOtpExpiry(600); // Reset expiry to 10 minutes
      });
    } catch {
      // Handled in useAuth hook
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-[480px] rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center gap-2">
            <span className="text-3xl">🔑</span>
          </div>
          <Title level={2} className="mb-2! text-gray-800!">
            Xác thực OTP
          </Title>
          <Text className="text-gray-500">
            Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email:
          </Text>
          <div className="mt-1 font-semibold text-gray-800">
            {email || "chưa xác định"}
          </div>
        </div>

        {/* Countdown Expiry */}
        <div className="mb-6 flex items-center justify-center gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-amber-800 shadow-xs">
          <span className="animate-pulse text-base">⏳</span>
          <span className="text-sm font-medium">
            {otpExpiry > 0 ? (
              <>
                Mã xác thực sẽ hết hạn sau:{" "}
                <span className="font-mono text-base font-bold text-amber-600">
                  {formatTime(otpExpiry)}
                </span>
              </>
            ) : (
              <span className="animate-pulse font-semibold text-red-600">
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
            className="mb-6 rounded-lg font-medium"
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
              style={{
                backgroundColor: "#22c55e",
                borderColor: "#22c55e",
              }}
              className="h-12 rounded-lg text-base font-medium shadow-sm hover:!border-green-600 hover:!bg-green-600"
            >
              Xác nhận kích hoạt
            </Button>
          </Form.Item>

          <div className="mt-6 text-center">
            {countdown > 0 ? (
              <Text className="text-gray-400">
                Gửi lại mã sau{" "}
                <span className="font-semibold text-green-600">
                  {countdown}s
                </span>
              </Text>
            ) : (
              <Button
                type="link"
                onClick={handleResend}
                loading={isResending}
                className="p-0 font-medium text-green-600 hover:text-green-700"
              >
                Gửi lại mã OTP
              </Button>
            )}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <Link
              href={ROUTES.REGISTER}
              className="text-sm font-medium text-gray-400 hover:text-gray-600"
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <span className="animate-bounce text-4xl">🌱</span>
            <p className="mt-2 font-medium text-gray-500">Đang tải...</p>
          </div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
