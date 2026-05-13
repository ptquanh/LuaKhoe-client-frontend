"use client";

import { Alert, Button, Form, Input, Typography, Steps, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, resetPassword, isLoading, error, setError } =
    useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");

  const [formEmail] = Form.useForm();
  const [formReset] = Form.useForm();

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
                { min: 8, message: "Mật khẩu tối thiểu 8 ký tự" },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
                },
              ]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới"
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">
                  Xác nhận mật khẩu mới
                </span>
              }
              name="confirmNewPassword"
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
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
