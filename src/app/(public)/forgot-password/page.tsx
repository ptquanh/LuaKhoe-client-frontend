"use client";

import { Alert, Button, Form, Input, message, Steps, Typography } from "antd";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

const { Title, Text } = Typography;

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
    <div className="mt-1 mb-4 space-y-1 text-[13px]">
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, resetPassword, isLoading, error, setError } =
    useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");

  const [formEmail] = Form.useForm();
  const [formReset] = Form.useForm();
  const newPasswordValue = Form.useWatch("newPassword", formReset);

  const handleEmailSubmit = async (values: { email: string }) => {
    setError(null);
    await forgotPassword({ email: values.email }, () => {
      setEmail(values.email);
      setCurrentStep(1);
      message.success("Mã khôi phục đã được gửi về email của bạn.");
    });
  };

  const handleResetSubmit = async (values: any) => {
    setError(null);
    if (values.newPassword !== values.confirmNewPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    await resetPassword(
      {
        email,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
        otpCode: values.otpCode,
      },
      () => {
        message.success("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
        router.push(ROUTES.LOGIN);
      },
    );
  };

  return (
    <main className="bg-bg-page relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="border-border bg-bg-card w-full max-w-[480px] rounded-2xl border p-6 shadow-xs sm:p-8">
        {/* Header / Logo */}
        <div className="mb-6">
          <Link href={ROUTES.HOME} className="mb-6 inline-block">
            <BrandLogo size="md" />
          </Link>
          <Title level={2} className="font-heading text-text-primary! mb-1!">
            Quên mật khẩu
          </Title>
          <Text className="text-text-secondary!">
            Khôi phục mật khẩu tài khoản của bạn
          </Text>
        </div>

        <Steps
          current={currentStep}
          size="small"
          className="mb-8"
          items={[{ title: "Gửi yêu cầu" }, { title: "Đặt lại mật khẩu" }]}
        />

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-6 rounded-xl font-medium"
          />
        )}

        {currentStep === 0 ? (
          <Form
            form={formEmail}
            layout="vertical"
            onFinish={handleEmailSubmit}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="text-text-primary font-medium">
                  Email khôi phục
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
              className="mb-6"
            >
              <Input
                placeholder="Nhập email tài khoản"
                className="h-12 rounded-xl text-base sm:h-11 sm:text-sm"
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                className="h-12 rounded-xl text-base font-semibold shadow-xs"
              >
                Gửi mã OTP
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={formReset}
            layout="vertical"
            onFinish={handleResetSubmit}
            size="large"
            requiredMark={false}
          >
            <div className="border-primary-border bg-primary-light/60 text-text-primary mb-6 rounded-xl border p-4 text-sm">
              Mã xác nhận OTP đã được gửi về email:{" "}
              <strong className="text-primary font-semibold">{email}</strong>
            </div>

            <Form.Item
              label={
                <span className="text-text-primary font-medium">Mã OTP</span>
              }
              name="otpCode"
              rules={[
                { required: true, message: "Vui lòng nhập mã OTP" },
                { len: 6, message: "Mã OTP phải gồm 6 ký tự" },
              ]}
              className="mb-4"
            >
              <Input.OTP length={6} className="gap-2" />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-text-primary font-medium">
                  Mật khẩu mới
                </span>
              }
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                {
                  validator(_, value) {
                    const val = value || "";
                    const isLength = val.length >= 8;
                    const isUpper = /[A-Z]/.test(val);
                    const isLower = /[a-z]/.test(val);
                    const isSpecial = /[\W_]/.test(val);
                    if (isLength && isUpper && isLower && isSpecial) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu chưa đáp ứng yêu cầu bảo mật"),
                    );
                  },
                },
              ]}
              className="mb-2"
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới"
                className="h-12 rounded-xl text-base sm:h-11 sm:text-sm"
              />
            </Form.Item>

            <PasswordRequirements password={newPasswordValue} />

            <Form.Item
              label={
                <span className="text-text-primary font-medium">
                  Xác nhận mật khẩu mới
                </span>
              }
              name="confirmNewPassword"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu nhập lại không khớp!"),
                    );
                  },
                }),
              ]}
              className="mb-6"
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu mới"
                className="h-12 rounded-xl text-base sm:h-11 sm:text-sm"
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                className="h-12 rounded-xl text-base font-semibold shadow-xs"
              >
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}

        <div className="mt-6 text-center">
          <Link
            href={ROUTES.LOGIN}
            className="text-primary hover:text-primary-hover font-semibold"
          >
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}
