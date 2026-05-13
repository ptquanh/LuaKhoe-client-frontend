"use client";

import { Alert, Button, Checkbox, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { RegisterPayload } from "@/types/auth.type";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const payload: RegisterPayload = {
      username: values.username,
      email: values.email,
      password: values.password,
    };

    await register(payload, () => {
      // Auto redirect to verify-otp page with query parameters
      router.push(
        `${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(
          values.email,
        )}&action=register`,
      );
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-[480px] rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Header / Logo */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-lg font-bold text-green-800">Lúa Khoẻ</span>
          </div>
          <Title level={2} className="mb-1! text-gray-800!">
            Tạo tài khoản
          </Title>
          <Text className="text-gray-500">
            Đăng ký tài khoản để bắt đầu chẩn đoán bệnh lúa
          </Text>
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
          className="w-full"
        >
          <Form.Item
            label={
              <span className="font-medium text-gray-700">Tên đăng nhập</span>
            }
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập" },
              { min: 3, message: "Tên đăng nhập tối thiểu 3 ký tự" },
            ]}
            className="mb-4"
          >
            <Input
              placeholder="Nhập tên đăng nhập"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
            className="mb-4"
          >
            <Input
              placeholder="email@example.com"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Mật khẩu</span>}
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 8, message: "Mật khẩu tối thiểu 8 ký tự" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
              },
            ]}
            className="mb-6"
          >
            <Input.Password
              placeholder="Tối thiểu 8 ký tự, đủ chữ hoa/thường/số/ký tự đặc biệt"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Bạn phải đồng ý với điều khoản sử dụng"),
                      ),
              },
            ]}
            className="mb-6"
          >
            <Checkbox className="text-gray-500">
              Tôi đồng ý với{" "}
              <Link
                href="#"
                className="font-medium text-green-600 underline underline-offset-2 hover:text-green-700"
              >
                điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link
                href="#"
                className="font-medium text-green-600 underline underline-offset-2 hover:text-green-700"
              >
                chính sách bảo mật
              </Link>
            </Checkbox>
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
              Đăng ký
            </Button>
          </Form.Item>

          <div className="mt-6 text-center">
            <Text className="text-gray-500">Đã có tài khoản? </Text>
            <Link
              href={ROUTES.LOGIN}
              className="font-medium text-green-600 hover:text-green-700"
            >
              Đăng nhập
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
}
