"use client";

import { Alert, Button, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { LoginPayload } from "@/types/auth.type";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginPayload) => {
    await login(values, () => router.push(ROUTES.DIAGNOSE));
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center bg-white px-6 py-4 shadow-sm">
        <button
          onClick={() => router.push(ROUTES.HOME)}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🌾</span>
          <span className="text-lg font-bold text-green-800">Lúa Khoẻ</span>
        </button>
      </header>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mb-3 text-5xl">🌿</div>
            <Title level={2} className="!mb-1 !text-green-800">
              Đăng nhập
            </Title>
            <Text className="text-gray-400">
              Chào mừng bạn trở lại với Lúa Khoẻ
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6 rounded-lg"
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
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="email@example.com" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
              ]}
            >
              <Input.Password placeholder="••••••••" className="rounded-lg" />
            </Form.Item>

            <div className="mb-4 flex justify-end">
              <button className="text-sm text-green-600 hover:text-green-700">
                Quên mật khẩu?
              </button>
            </div>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                style={{
                  backgroundColor: "#166534",
                  borderColor: "#166534",
                  height: 48,
                  fontSize: 16,
                }}
                className="rounded-lg font-medium"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-4 text-center">
            <Text className="text-gray-400">Chưa có tài khoản? </Text>
            <button
              onClick={() => router.push(ROUTES.REGISTER)}
              className="font-medium text-green-600 hover:text-green-700"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
