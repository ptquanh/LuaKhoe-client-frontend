"use client";

import { Save, User, MapPin, KeyRound } from "lucide-react";
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
} from "antd";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ChangePasswordPayload, UpdateProfilePayload } from "@/types/auth.type";

const { Title, Text } = Typography;

// Dynamically import the map to avoid window undefined SSR error
const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      <p className="mt-3 text-sm font-medium text-gray-400">
        Đang tải bản đồ...
      </p>
    </div>
  ),
});

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
  const [mapLat, setMapLat] = useState("");
  const [mapLng, setMapLng] = useState("");

  // Sync profile data to form & map states when loaded
  useEffect(() => {
    if (profile && profile.profile) {
      const lat = profile.profile.gpsLatitude
        ? profile.profile.gpsLatitude.toString()
        : "";
      const lng = profile.profile.gpsLongitude
        ? profile.profile.gpsLongitude.toString()
        : "";
      formProfile.setFieldsValue({
        firstName: profile.profile.firstName || "",
        lastName: profile.profile.lastName || "",
        latitude: lat,
        longitude: lng,
      });
      setMapLat(lat);
      setMapLng(lng);
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
      // Backend expects a JSON string under "gps" field
      payload.gps = JSON.stringify({
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      });
    }

    await updateProfile(payload, () => {
      message.success("Cập nhật thông tin cá nhân thành công!");
    });
  };

  // Handle map selection
  const handleMapLocationSelect = (lat: number, lng: number) => {
    const latStr = lat.toFixed(6);
    const lngStr = lng.toFixed(6);
    formProfile.setFieldsValue({
      latitude: latStr,
      longitude: lngStr,
    });
    setMapLat(latStr);
    setMapLng(lngStr);
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
        const latStr = position.coords.latitude.toFixed(6);
        const lngStr = position.coords.longitude.toFixed(6);
        formProfile.setFieldsValue({
          latitude: latStr,
          longitude: lngStr,
        });
        setMapLat(latStr);
        setMapLng(lngStr);
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

  // Render map position array
  const parsedLat = parseFloat(mapLat);
  const parsedLng = parseFloat(mapLng);
  const mapPosition: [number, number] =
    !isNaN(parsedLat) && !isNaN(parsedLng)
      ? [parsedLat, parsedLng]
      : [10.762622, 106.660172]; // Default to Ho Chi Minh City if not available

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pb-20 sm:px-6">
      <div>
        <Title level={2} className="mb-1! text-gray-800!">
          Thông tin cá nhân
        </Title>
        <Text className="text-gray-500">
          Quản lý thông tin hồ sơ và bảo mật tài khoản của bạn
        </Text>
      </div>

      {/* Avatar Card */}
      <Card className="rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
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

      <Form
        form={formProfile}
        layout="vertical"
        onFinish={handleSaveProfile}
        size="large"
        requiredMark={false}
        className="flex flex-col gap-8"
      >
        {/* Card 1: Basic Profile Info */}
        <Card
          className="rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
          title={
            <span className="text-lg font-bold text-gray-800">
              Thông tin cơ bản
            </span>
          }
        >
          {profileError && (
            <Alert
              message={profileError}
              type="error"
              showIcon
              className="mb-6 rounded-lg font-medium"
            />
          )}

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
                  className="cursor-not-allowed rounded-lg bg-gray-50 text-gray-500"
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
                  className="cursor-not-allowed rounded-lg bg-gray-50 text-gray-500"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Card 2: Rice Field GPS Location */}
        <Card
          className="rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
          title={
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-gray-800">
                Vị trí ruộng (GPS)
              </span>
            </div>
          }
          extra={
            <Button
              type="dashed"
              onClick={handleGetCurrentGps}
              loading={isGpsLoading}
              className="flex items-center justify-center rounded-lg text-xs font-medium hover:!border-green-600 hover:!text-green-600 sm:text-sm"
            >
              Lấy vị trí tự động
            </Button>
          }
        >
          <div className="mb-5">
            <p className="text-sm leading-relaxed text-gray-500">
              Vui lòng kéo thả Marker màu xanh hoặc click vào vị trí bất kì trên
              bản đồ dưới đây để chọn tọa độ mảnh ruộng của bạn. Hệ thống sẽ tự
              động đồng bộ.
            </p>
          </div>

          {/* Interactive Leaflet Map */}
          <div className="mb-6 h-[320px] w-full overflow-hidden rounded-2xl border border-gray-100 shadow-inner">
            <LocationMap
              position={mapPosition}
              onLocationSelect={handleMapLocationSelect}
            />
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
                <Input
                  placeholder="Ví dụ: 10.7626"
                  className="rounded-lg"
                  onChange={(e) => setMapLat(e.target.value)}
                />
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
                <Input
                  placeholder="Ví dụ: 106.6602"
                  className="rounded-lg"
                  onChange={(e) => setMapLng(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="mt-2 flex justify-start">
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              icon={<Save className="h-4 w-4" />}
              style={{
                backgroundColor: "#22c55e",
                borderColor: "#22c55e",
              }}
              className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-sm hover:!border-green-600 hover:!bg-green-600"
            >
              Lưu thay đổi hồ sơ & vị trí
            </Button>
          </div>
        </Card>
      </Form>

      {/* Card 3: Security & Password Section */}
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
            className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-sm hover:!border-green-600 hover:!bg-green-600"
          >
            Đổi mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
}
