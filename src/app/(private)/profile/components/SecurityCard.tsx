import { Alert, Button, Card, Form, Input } from "antd";
import { Check, KeyRound, X } from "lucide-react";

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
  const newPasswordValue = Form.useWatch("newPassword", formPassword);
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
            placeholder="Tối thiểu 8 ký tự, đủ chữ hoa/thường/ký tự đặc biệt"
            className="rounded-lg"
          />
        </Form.Item>

        <PasswordRequirements password={newPasswordValue} />

        <Form.Item
          label={
            <span className="font-medium text-gray-700">
              Xác nhận mật khẩu mới
            </span>
          }
          name="confirmPassword"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
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
