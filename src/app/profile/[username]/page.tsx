"use client";

import { Card, Col, Result, Row, Spin, Tag } from "antd";
import { Calendar, CheckCircle, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import SharedHeader from "@/components/layout/SharedHeader";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";

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
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
        <SharedHeader />
        <div className="flex h-[70vh] items-center justify-center">
          <Spin size="large" description="Đang tải thông tin hồ sơ..." />
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
        <SharedHeader />
        <div className="mx-auto max-w-xl px-6 py-20">
          <Result
            status="404"
            title="404"
            subTitle={error || "Không tìm thấy người dùng."}
            extra={
              <Link href="/">
                <button className="min-h-11 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--primary-hover)]">
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

  const roleLabel = profileData.role === "ADMIN" ? "Quản trị viên" : "Nông dân";
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
    profileData.status === "ACTIVE" || profileData.isActive === true;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <SharedHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 pb-20 sm:px-6">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-[var(--text-primary)]">
            Hồ sơ thành viên
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Xem thông tin cá nhân công khai của thành viên trên diễn đàn
          </p>
        </div>

        {/* Own Profile Notice */}
        {isOwnProfile && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary-soft)]/50 p-4 text-sm text-[var(--text-primary)]">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 shrink-0 text-[var(--primary)]" />
              <span>
                Đây là trang hồ sơ công khai của bạn. Người khác sẽ nhìn thấy
                thông tin này.
              </span>
            </div>
            <Link href="/profile">
              <button className="min-h-10 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[var(--primary-hover)]">
                Chỉnh sửa hồ sơ
              </button>
            </Link>
          </div>
        )}

        {/* Profile Main Card */}
        <Card className="overflow-hidden rounded-2xl border-[var(--border)] bg-[var(--bg-card)] shadow-sm transition-colors duration-200 hover:shadow-md">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-left">
            {/* Profile Avatar */}
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-[var(--primary)] bg-[var(--bg-subtle)] shadow-md">
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
                <div className="flex h-full w-full items-center justify-center bg-[var(--primary-soft)] text-3xl font-bold text-[var(--primary)]">
                  {profileData.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                <h2 className="m-0! text-2xl font-bold text-[var(--text-primary)]">
                  {displayName}
                </h2>
                <Tag
                  color={profileData.role === "ADMIN" ? "red" : "green"}
                  className="m-0! rounded-full px-2.5 py-0.5 text-xs font-semibold"
                >
                  {roleLabel}
                </Tag>
              </div>

              <p className="font-mono text-sm text-[var(--text-secondary)]">
                @{profileData.username}
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-xs text-[var(--text-muted)] sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                  Tham gia ngày {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Details Card */}
        <Card
          className="rounded-2xl border-[var(--border)] bg-[var(--bg-card)] shadow-sm transition-colors duration-200 hover:shadow-md"
          title={
            <span className="text-lg font-bold text-[var(--text-primary)]">
              Thông tin chi tiết
            </span>
          }
        >
          <div className="space-y-6">
            <Row gutter={[16, 24]}>
              <Col xs={24} sm={12} className="space-y-1">
                <span className="block text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                  Email liên hệ
                </span>
                <div className="flex items-center gap-2.5 text-sm text-[var(--text-primary)]">
                  <Mail className="h-4 w-4 text-[var(--primary)]" />
                  <span>{profileData.email}</span>
                </div>
              </Col>

              <Col xs={24} sm={12} className="space-y-1">
                <span className="block text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                  Số điện thoại
                </span>
                <div className="flex items-center gap-2.5 text-sm text-[var(--text-primary)]">
                  <Phone className="h-4 w-4 text-[var(--primary)]" />
                  <span>{activeProfile?.phone || "Chưa cập nhật"}</span>
                </div>
              </Col>

              <Col xs={24} sm={12} className="space-y-1">
                <span className="block text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                  Trạng thái tài khoản
                </span>
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${isAccountActive ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                  <span className="ml-1 font-semibold text-[var(--text-primary)]">
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
