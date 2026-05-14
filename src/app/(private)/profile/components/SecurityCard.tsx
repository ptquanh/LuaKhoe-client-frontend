import { Alert, Button, Card, Form, Input } from "antd";
import { KeyRound } from "lucide-react";
import React from "react";

interface SecurityCardProps {
  formPassword: any;
  handleChangePassword: (values: any) => void;
  authError: string | null;
  isScreenLoading: boolean;
}

export function SecurityCard({
  formPassword,
  handleChangePassword,
  authError,
  isScreenLoading,
}: SecurityCardProps) {
  return (
    <Card
      className="rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
      title={
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-green-600" />
          <span className="text-lg font-bold text-gray-800">
            Bảo mật & Mật khẩu
          </span>
        </div>
      }
    >
      {authError && (
        <Alert
          message={authError}
          type="error"
          showIcon
          className="mb-6 rounded-lg font-medium"
        />
      )}

      <Form
        form={formPassword}
        layout="vertical"
        onFinish={handleChangePassword}
        size="large"
        requiredMark={false}
      >
        <Form.Item
          label={
            <span className="font-medium text-gray-700">Mật khẩu hiện tại</span>
          }
          name="oldPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
          ]}
          className="mb-4"
        >
          <Input.Password
            placeholder="Nhập mật khẩu cũ"
            className="rounded-lg"
          />
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
            placeholder="Tối thiểu 8 ký tự, đủ chữ hoa/thường/số/ký tự đặc biệt"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-medium text-gray-700">
              Xác nhận mật khẩu mới
            </span>
          }
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
          ]}
          className="mb-6"
        >
          <Input.Password
            placeholder="Xác nhận mật khẩu mới"
            className="rounded-lg"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={isScreenLoading}
          icon={<KeyRound className="h-4 w-4" />}
          style={{
            backgroundColor: "#22c55e",
            borderColor: "#22c55e",
          }}
          className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-sm hover:!border-green-600 hover:!bg-green-600"
        >
          Đổi mật khẩu
        </Button>
      </Form>
    </Card>
  );
}
