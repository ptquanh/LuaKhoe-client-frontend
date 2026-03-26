"use client";

import { Alert, Button, Checkbox, Form, Input, Select, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { RegisterPayload } from "@/types/auth.type";

const { Title, Text } = Typography;

const PROVINCES = [
  { value: "An Giang", label: "An Giang" },
  { value: "Bạc Liêu", label: "Bạc Liêu" },
  { value: "Bến Tre", label: "Bến Tre" },
  { value: "Cà Mau", label: "Cà Mau" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Đồng Tháp", label: "Đồng Tháp" },
  { value: "Hậu Giang", label: "Hậu Giang" },
  { value: "Kiên Giang", label: "Kiên Giang" },
  { value: "Long An", label: "Long An" },
  { value: "Sóc Trăng", label: "Sóc Trăng" },
  { value: "Tiền Giang", label: "Tiền Giang" },
  { value: "Trà Vinh", label: "Trà Vinh" },
  { value: "Vĩnh Long", label: "Vĩnh Long" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const payload: RegisterPayload = {
      full_name: values.full_name,
      phone: values.phone,
      email: values.email || undefined,
      password: values.password,
      province: values.province,
    };
    await register(payload, () => router.push(ROUTES.DIAGNOSE));
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
            Bắt đầu chẩn đoán bệnh lúa miễn phí
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
            label={<span className="font-medium text-gray-700">Họ và tên</span>}
            name="full_name"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            className="mb-4"
          >
            <Input placeholder="Nguyễn Văn A" className="h-11 rounded-lg" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">Số điện thoại</span>
            }
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
            className="mb-4"
          >
            <Input placeholder="0901234567" className="h-11 rounded-lg" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Email{" "}
                <span className="font-normal text-gray-400">(tùy chọn)</span>
              </span>
            }
            name="email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
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
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
            ]}
            className="mb-4"
          >
            <Input.Password
              placeholder="Tối thiểu 6 ký tự"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Tỉnh / Thành phố
              </span>
            }
            name="province"
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
            ]}
            className="mb-6"
          >
            <Select
              placeholder="-- Chọn tỉnh/thành --"
              className="h-11 rounded-lg"
              options={PROVINCES}
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
