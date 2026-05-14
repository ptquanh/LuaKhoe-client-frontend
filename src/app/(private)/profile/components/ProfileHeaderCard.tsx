import { Card } from "antd";
import { User as UserIcon } from "lucide-react";
import React from "react";

import { User } from "@/types/auth.type";

interface ProfileHeaderCardProps {
  user: User | null;
  profile: any;
}

export function ProfileHeaderCard({ user, profile }: ProfileHeaderCardProps) {
  const displayName =
    profile?.profile?.firstName || profile?.profile?.lastName
      ? `${profile.profile.lastName || ""} ${profile.profile.firstName || ""}`.trim()
      : user?.username || "Nông dân";

  const roleLabel = user?.role === "ADMIN" ? "Quản trị viên" : "Farmer";

  return (
    <Card className="rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-200 bg-green-50">
          <UserIcon className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800">
              {displayName}
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-600/20 ring-inset">
              {roleLabel}
            </span>
          </div>
          <div className="mt-0.5 text-sm text-gray-500">{user?.email}</div>
        </div>
      </div>
    </Card>
  );
}
