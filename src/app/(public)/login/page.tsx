"use client";

import { Alert, Button, Checkbox, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { LoginPayload } from "@/types/auth.type";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: {
    phone: string;
    password: string;
    remember?: boolean;
  }) => {
    const payload: LoginPayload = {
      phone: values.phone,
      password: values.password,
    };

    // In a real app, 'admin' might have a different route/permission. Here we just login normally,
    // and let the backend return the user role. Then we can redirect based on role.
    await login(payload, () => router.push(ROUTES.DIAGNOSE));
  };

  return (
    <main className="flex min-h-screen bg-white">
      {/* Left side: Image banner (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-end overflow-hidden p-12 lg:flex">
        {/* Unsplash image representing a Vietnamese rice field/mountain landscape */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/background-login.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-lg text-white">
          <h1 className="mb-4 text-4xl leading-tight font-bold">
            Chẩn đoán bệnh lúa
            <br />
            bằng trí tuệ nhân tạo
          </h1>
          <p className="text-lg text-gray-200">
            Bảo vệ mùa màng với công nghệ AI tiên tiến
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex w-full items-center justify-center p-8 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <div className="mb-8 flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="text-lg font-bold text-green-800">Lúa Khoẻ</span>
            </div>
            <Title level={2} className="mb-2! text-gray-800!">
              Đăng nhập
            </Title>
            <Text className="text-gray-500">Chào mừng bạn trở lại!</Text>
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
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="font-medium text-gray-700">Số điện thoại</span>
              }
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập số điện thoại"
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Mật khẩu</span>
              }
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              className="mb-5"
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <div className="mb-6 flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-500">Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>

              <Link
                href="#"
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                style={{
                  backgroundColor: "#22c55e",
                  borderColor: "#22c55e",
                }}
                className="h-12 rounded-lg text-base font-medium shadow-sm hover:border-green-600! hover:bg-green-600!"
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text className="text-gray-500">Chưa có tài khoản? </Text>
              <Link
                href={ROUTES.REGISTER}
                className="font-medium text-green-600 hover:text-green-700"
              >
                Đăng ký ngay
              </Link>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6 text-center">
              <Text className="text-xs text-gray-400">
                Nhập &quot;admin&quot; làm số điện thoại để xem Admin Dashboard
              </Text>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}
