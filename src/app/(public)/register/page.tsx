"use client";

import { Alert, Button, Checkbox, Form, Input, Typography } from "antd";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { RegisterPayload } from "@/types/auth.type";

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

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [form] = Form.useForm();
  const passwordValue = Form.useWatch("password", form);

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
          validateTrigger="onBlur"
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
              placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
              className="h-11 rounded-lg"
            />
          </Form.Item>
          {/* Password requirements panel */}
          <PasswordRequirements password={passwordValue} />

          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Nhập lại mật khẩu
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
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
              placeholder="Nhập lại mật khẩu"
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
