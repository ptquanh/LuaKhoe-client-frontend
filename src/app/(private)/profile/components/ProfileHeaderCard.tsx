import { Card } from "antd";
import React from "react";

import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { User } from "@/types/auth.type";

interface ProfileHeaderCardProps {
  user: User | null;
  profile: any;
}

export function ProfileHeaderCard({ user, profile }: ProfileHeaderCardProps) {
  const activeProfile =
    profile?.role === "ADMIN" ? profile?.adminProfile : profile?.farmerProfile;
  const displayName =
    activeProfile?.firstName || activeProfile?.lastName
      ? `${activeProfile.lastName || ""} ${activeProfile.firstName || ""}`.trim()
      : user?.username || "Người dùng";

  const roleLabel = user?.role === "ADMIN" ? "Quản trị viên" : "Nông dân";

  return (
    <Card className="rounded-2xl border-[var(--border)] bg-[var(--bg-card)] shadow-sm transition-colors duration-200 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-5">
        <AvatarUpload
          avatarUrl={user?.avatarUrl || ""}
          username={user?.username || ""}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-xl font-bold text-[var(--text-primary)]">
              {displayName}
            </span>
            <span className="inline-flex items-center rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
              {roleLabel}
            </span>
          </div>
          <div className="mt-0.5 truncate text-sm text-[var(--text-secondary)]">
            {user?.email}
          </div>
        </div>
      </div>
    </Card>
  );
}
