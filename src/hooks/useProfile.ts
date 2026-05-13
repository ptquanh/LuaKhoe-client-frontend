import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { userService } from "@/services/user.service";
import { UpdateProfilePayload, UserWithProfile } from "@/types/auth.type";

const getErrorMessage = (err: any): string => {
  const data = err.response?.data;
  if (!data) return "Kết nối máy chủ thất bại.";
  if (Array.isArray(data.message)) return data.message.join(", ");
  return data.message || data.detail || "Đã có lỗi xảy ra. Vui lòng thử lại.";
};

export function useProfile() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await userService.getProfile();
      return res.data || null;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      setError(null);
      const res = await userService.updateProfile(payload);
      if (!res.success) {
        throw new Error(res.message || "Cập nhật thông tin thất bại.");
      }
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], data);
      // Also invalidate whoami/auth-me just in case profile elements are shared
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    onError: (err: any) => {
      setError(getErrorMessage(err));
    },
  });

  const updateProfile = async (
    payload: UpdateProfilePayload,
    onSuccess?: () => void,
  ) => {
    try {
      await updateProfileMutation.mutateAsync(payload);
      onSuccess?.();
    } catch {
      // Handled in onError
    }
  };

  return {
    profile: profileResponse,
    isLoading: isProfileLoading,
    updateProfile,
    isUpdating: updateProfileMutation.isPending,
    error,
    setError,
  };
}
