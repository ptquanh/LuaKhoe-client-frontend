"use client";

import { Form, message, Typography } from "antd";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ChangePasswordPayload, UpdateProfilePayload } from "@/types/auth.type";

import { BasicInfoCard } from "./components/BasicInfoCard";
import { FieldManagementCard } from "./components/FieldManagementCard";
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

  useEffect(() => {
    if (profile && profile.profile) {
      formProfile.setFieldsValue({
        firstName: profile.profile.firstName || "",
        lastName: profile.profile.lastName || "",
      });
    }
  }, [profile, formProfile]);

  const handleSaveProfile = async (values: any) => {
    setProfileError(null);
    const payload: UpdateProfilePayload = {
      firstName: values.firstName,
      lastName: values.lastName,
    };

    await updateProfile(payload, () => {
      message.success("Cập nhật thông tin cá nhân thành công!");
    });
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

        <div className="mt-2 flex justify-start">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#22c55e] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600 disabled:opacity-50"
          >
            {isUpdating ? "Đang lưu..." : "Lưu thay đổi hồ sơ"}
          </button>
        </div>
      </Form>

      <FieldManagementCard />

      <SecurityCard
        formPassword={formPassword}
        handleChangePassword={handleChangePassword}
        authError={authError}
        isScreenLoading={isScreenLoading}
      />
    </div>
  );
}
