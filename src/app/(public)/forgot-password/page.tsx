"use client";

import { Alert, Button, Form, Input, message, Steps, Typography } from "antd";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, resetPassword, isLoading, error, setError } =
    useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");

  const [formEmail] = Form.useForm();
  const [formReset] = Form.useForm();
  const newPasswordValue = Form.useWatch("newPassword", formReset);

  // Step 1: Submit email to request OTP
  const handleEmailSubmit = async (values: { email: string }) => {
    setError(null);
    await forgotPassword({ email: values.email }, () => {
      setEmail(values.email);
      setCurrentStep(1);
      message.success("Mã khôi phục đã được gửi về email của bạn.");
    });
  };

  // Step 2: Submit OTP and New Password to reset
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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-[480px] rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Header / Logo */}
        <div className="mb-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-lg font-bold text-green-800">Lúa Khoẻ</span>
          </div>
          <Title level={2} className="mb-1! text-gray-800!">
            Quên mật khẩu
          </Title>
          <Text className="text-gray-500">
            Khôi phục mật khẩu tài khoản của bạn
          </Text>
        </div>

        {/* Steps indicator */}
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
            className="mb-6 rounded-lg font-medium"
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
                <span className="font-medium text-gray-700">
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
                className="h-11 rounded-lg"
              />
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
            <div className="mb-6 rounded-lg border border-green-100 bg-green-50/50 p-4 text-sm text-green-800">
              Mã xác nhận OTP đã được gửi về email:{" "}
              <strong className="font-semibold">{email}</strong>
            </div>

            <Form.Item
              label={<span className="font-medium text-gray-700">Mã OTP</span>}
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
                <span className="font-medium text-gray-700">Mật khẩu mới</span>
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
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <PasswordRequirements password={newPasswordValue} />

            <Form.Item
              label={
                <span className="font-medium text-gray-700">
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
                className="h-11 rounded-lg"
              />
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
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}

        <div className="mt-6 text-center">
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-green-600 hover:text-green-700"
          >
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}
