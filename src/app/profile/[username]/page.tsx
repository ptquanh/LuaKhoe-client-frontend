"use client";

import SharedHeader from "@/components/layout/SharedHeader";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import { Card, Col, Result, Row, Spin, Tag } from "antd";
import { Calendar, CheckCircle, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicProfilePage() {
  const params = useParams();

  const { user: currentUser } = useAuth();

  const identifier = params?.username as string;

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!identifier) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      // Fetch by username
      try {
        const res = await userService.getUserByUsername(identifier);
        if (res?.success && res?.data) {
          setProfileData(res.data);
        } else {
          setError(res?.message || "Không tìm thấy người dùng");
        }
      } catch (err: any) {
        setError("Không tìm thấy người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] font-[Inter,sans-serif]">
        <SharedHeader />
        <div className="flex h-[70vh] items-center justify-center">
          <Spin size="large" description="Đang tải thông tin hồ sơ..." />
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] font-[Inter,sans-serif]">
        <SharedHeader />
        <div className="mx-auto max-w-xl px-6 py-20">
          <Result
            status="404"
            title="404"
            subTitle={error || "Không tìm thấy người dùng."}
            extra={
              <Link href="/">
                <button className="rounded-xl bg-[#22c55e] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600">
                  Quay lại Trang chủ
                </button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const activeProfile =
    profileData.role === "ADMIN"
      ? profileData.adminProfile
      : profileData.farmerProfile;

  const displayName =
    activeProfile?.firstName || activeProfile?.lastName
      ? `${activeProfile.lastName || ""} ${activeProfile.firstName || ""}`.trim()
      : profileData.username;

  const roleLabel = profileData.role === "ADMIN" ? "Quản trị viên" : "Farmer";
  const formattedDate = profileData.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Chưa rõ";

  const isOwnProfile =
    currentUser && currentUser.username === profileData.username;

  const isAccountActive =
    profileData.status === "active" ||
    profileData.status === "ACTIVE" ||
    profileData.isActive === true;

  return (
    <div className="min-h-screen bg-[#F7F7F7] font-[Inter,sans-serif]">
      <SharedHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 pb-20 sm:px-6">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-gray-800">
            Hồ sơ thành viên
          </h2>
          <p className="text-sm text-gray-500">
            Xem thông tin cá nhân công khai của thành viên trên diễn đàn
          </p>
        </div>

        {/* Own Profile Notice */}
        {isOwnProfile && (
          <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50/50 p-4 text-[14px] text-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#22c55e]" />
              <span>
                Đây là trang hồ sơ công khai của bạn. Người khác sẽ nhìn thấy
                thông tin này.
              </span>
            </div>
            <Link href="/profile">
              <button className="rounded-xl bg-[#22c55e] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-green-600">
                Chỉnh sửa hồ sơ
              </button>
            </Link>
          </div>
        )}

        {/* Profile Main Card */}
        <Card className="overflow-hidden rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-left">
            {/* Profile Avatar */}
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-green-500 bg-gray-50 shadow-md">
              {profileData.avatarUrl && profileData.avatarUrl !== "" ? (
                <Image
                  src={profileData.avatarUrl}
                  alt={profileData.username}
                  fill
                  sizes="112px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-green-50 text-3xl font-bold text-green-600">
                  {profileData.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                <h2 className="m-0! text-2xl font-bold text-gray-800">
                  {displayName}
                </h2>
                <Tag
                  color={profileData.role === "ADMIN" ? "red" : "green"}
                  className="m-0! rounded-full px-2.5 py-0.5 text-xs font-semibold"
                >
                  {roleLabel}
                </Tag>
              </div>

              <p className="font-mono text-sm text-gray-500">
                @{profileData.username}
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Tham gia ngày {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Details Card */}
        <Card
          className="rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
          title={
            <span className="text-lg font-bold text-gray-800">
              Thông tin chi tiết
            </span>
          }
        >
          <div className="space-y-6">
            <Row gutter={[16, 24]}>
              <Col xs={24} sm={12} className="space-y-1">
                <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Email liên hệ
                </span>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-green-500" />
                  <span>{profileData.email}</span>
                </div>
              </Col>

              <Col xs={24} sm={12} className="space-y-1">
                <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Số điện thoại
                </span>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span>{activeProfile?.phone || "Chưa cập nhật"}</span>
                </div>
              </Col>

              <Col xs={24} sm={12} className="space-y-1">
                <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Trạng thái tài khoản
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${isAccountActive ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="ml-1 font-semibold text-gray-700">
                    {isAccountActive ? "Đang hoạt động" : "Tạm khóa"}
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </main>
    </div>
  );
}
