"use client";

import { Save, User, MapPin, KeyRound, CheckCircle } from "lucide-react";
import {
  Alert,
  Button,
  Form,
  Input,
  Typography,
  message,
  Card,
  Row,
  Col,
  Space,
} from "antd";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ChangePasswordPayload, UpdateProfilePayload } from "@/types/auth.type";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const {
    user,
    changePassword,
    isLoading: isAuthLoading,
    error: authError,
    setError: setAuthError,
  } = useAuth();
  const {
    profile,
    isLoading: isProfileLoading,
    updateProfile,
    isUpdating,
    error: profileError,
    setError: setProfileError,
  } = useProfile();

  const [formProfile] = Form.useForm();
  const [formPassword] = Form.useForm();
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Sync profile data to form when loaded
  useEffect(() => {
    if (profile && profile.profile) {
      formProfile.setFieldsValue({
        firstName: profile.profile.firstName || "",
        lastName: profile.profile.lastName || "",
        latitude: profile.profile.gpsLatitude || "",
        longitude: profile.profile.gpsLongitude || "",
      });
    }
  }, [profile, formProfile]);

  // Handle personal info & GPS saving
  const handleSaveProfile = async (values: any) => {
    setProfileError(null);
    const payload: UpdateProfilePayload = {
      firstName: values.firstName,
      lastName: values.lastName,
    };

    if (values.latitude && values.longitude) {
      payload.gps = {
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      };
    }

    await updateProfile(payload, () => {
      message.success("Cập nhật thông tin cá nhân thành công!");
    });
  };

  // Get current GPS using Browser Geolocation
  const handleGetCurrentGps = () => {
    if (!navigator.geolocation) {
      message.error("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        formProfile.setFieldsValue({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });
        message.success("Đã lấy toạ độ GPS hiện tại thành công!");
        setIsGpsLoading(false);
      },
      (error) => {
        console.error(error);
        message.error(
          "Không thể lấy vị trí GPS. Vui lòng cho phép quyền truy cập vị trí.",
        );
        setIsGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Handle password change
  const handleChangePassword = async (values: any) => {
    setAuthError(null);
    if (values.newPassword !== values.confirmPassword) {
      setAuthError("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }

    const payload: ChangePasswordPayload = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };

    await changePassword(payload, () => {
      message.success("Đổi mật khẩu thành công!");
      formPassword.resetFields();
    });
  };

  const isScreenLoading = isProfileLoading || isAuthLoading;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <div className="mb-8">
        <Title level={2} className="mb-1! text-gray-800!">
          Thông tin cá nhân
        </Title>
        <Text className="text-gray-500">
          Quản lý thông tin hồ sơ và bảo mật tài khoản của bạn
        </Text>
      </div>

      {/* Avatar Card */}
      <Card className="mb-6 rounded-2xl border-gray-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-200 bg-green-50">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">
                {profile?.profile?.firstName || profile?.profile?.lastName
                  ? `${profile.profile.lastName || ""} ${profile.profile.firstName || ""}`.trim()
                  : user?.username || "Nông dân"}
              </span>
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-600/20 ring-inset">
                {user?.role === "ADMIN" ? "Quản trị viên" : "Farmer"}
              </span>
            </div>
            <div className="mt-0.5 text-sm text-gray-500">{user?.email}</div>
          </div>
        </div>
      </Card>

      {/* Profile info and Location GPS Section */}
      <Card
        className="mb-6 rounded-2xl border-gray-100 shadow-sm"
        title="Thông tin cơ bản"
      >
        {profileError && (
          <Alert
            message={profileError}
            type="error"
            showIcon
            className="mb-6 rounded-lg font-medium"
          />
        )}

        <Form
          form={formProfile}
          layout="vertical"
          onFinish={handleSaveProfile}
          size="large"
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Họ & tên đệm
                  </span>
                }
                name="lastName"
                rules={[{ required: true, message: "Vui lòng nhập Họ" }]}
              >
                <Input placeholder="Nguyễn Văn" className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-medium text-gray-700">Tên</span>}
                name="firstName"
                rules={[{ required: true, message: "Vui lòng nhập Tên" }]}
              >
                <Input placeholder="A" className="rounded-lg" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Tên đăng nhập
                  </span>
                }
              >
                <Input
                  value={user?.username}
                  disabled
                  className="rounded-lg bg-gray-50 text-gray-500"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-medium text-gray-700">Email</span>}
              >
                <Input
                  value={user?.email}
                  disabled
                  className="rounded-lg bg-gray-50 text-gray-500"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="mt-4 mb-6 border-t border-gray-100 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="flex items-center gap-1.5 text-base font-semibold text-gray-800">
                  <MapPin className="h-5 w-5 text-green-600" /> Vị trí ruộng
                  (GPS)
                </h4>
                <p className="mt-0.5 text-xs text-gray-400">
                  Cung cấp toạ độ GPS giúp hệ thống hỗ trợ tốt hơn cho vùng
                  trồng của bạn.
                </p>
              </div>
              <Button
                type="dashed"
                onClick={handleGetCurrentGps}
                loading={isGpsLoading}
                className="hover:!border-green-600 hover:!text-green-600"
              >
                Lấy vị trí tự động
              </Button>
            </div>

            <Row gutter={16}>
              <Col xs={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Vĩ độ (Latitude)
                    </span>
                  }
                  name="latitude"
                >
                  <Input placeholder="Ví dụ: 10.7626" className="rounded-lg" />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Kinh độ (Longitude)
                    </span>
                  }
                  name="longitude"
                >
                  <Input placeholder="Ví dụ: 106.6602" className="rounded-lg" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdating}
            icon={<Save className="h-4 w-4" />}
            style={{
              backgroundColor: "#22c55e",
              borderColor: "#22c55e",
            }}
            className="flex h-10 items-center gap-2 rounded-lg text-sm font-medium shadow-sm hover:!border-green-600 hover:!bg-green-600"
          >
            Lưu thay đổi
          </Button>
        </Form>
      </Card>

      {/* Security Section (Change Password) */}
      <Card
        className="rounded-2xl border-gray-100 shadow-sm"
        title="Bảo mật & Mật khẩu"
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
              <span className="font-medium text-gray-700">
                Mật khẩu hiện tại
              </span>
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
            className="flex h-10 items-center gap-2 rounded-lg text-sm font-medium shadow-sm hover:!border-green-600 hover:!bg-green-600"
          >
            Đổi mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
}
