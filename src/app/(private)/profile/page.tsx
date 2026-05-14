"use client";

import { Form, message, Typography } from "antd";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ChangePasswordPayload, UpdateProfilePayload } from "@/types/auth.type";

import { BasicInfoCard } from "./components/BasicInfoCard";
import { MapLocationCard } from "./components/MapLocationCard";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { SecurityCard } from "./components/SecurityCard";

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
  const [mapLat, setMapLat] = useState("");
  const [mapLng, setMapLng] = useState("");

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

  const handleSaveProfile = async (values: any) => {
    setProfileError(null);
    const payload: UpdateProfilePayload = {
      firstName: values.firstName,
      lastName: values.lastName,
    };

    if (values.latitude && values.longitude) {
      payload.gps = JSON.stringify({
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      });
    }

    await updateProfile(payload, () => {
      message.success("Cập nhật thông tin cá nhân thành công!");
    });
  };

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

  const parsedLat = parseFloat(mapLat);
  const parsedLng = parseFloat(mapLng);
  const mapPosition: [number, number] =
    !isNaN(parsedLat) && !isNaN(parsedLng)
      ? [parsedLat, parsedLng]
      : [10.762622, 106.660172];

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

      <ProfileHeaderCard user={user || null} profile={profile} />

      <Form
        form={formProfile}
        layout="vertical"
        onFinish={handleSaveProfile}
        size="large"
        requiredMark={false}
        className="flex flex-col gap-8"
      >
        <BasicInfoCard user={user || null} profileError={profileError} />

        <MapLocationCard
          mapPosition={mapPosition}
          handleMapLocationSelect={handleMapLocationSelect}
          handleGetCurrentGps={handleGetCurrentGps}
          isGpsLoading={isGpsLoading}
          isUpdating={isUpdating}
          setMapLat={setMapLat}
          setMapLng={setMapLng}
        />
      </Form>

      <SecurityCard
        formPassword={formPassword}
        handleChangePassword={handleChangePassword}
        authError={authError}
        isScreenLoading={isScreenLoading}
      />
    </div>
  );
}
