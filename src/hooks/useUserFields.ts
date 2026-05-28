import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { userFieldService } from "@/services/user-field.service";
import {
  CreateUserFieldPayload,
  UpdateUserFieldPayload,
} from "@/types/auth.type";

const getErrorMessage = (err: any): string => {
  // Handle Network Error explicitly
  if (
    err.message === "Network Error" ||
    err.code === "ERR_NETWORK" ||
    (err.message && err.message.toLowerCase().includes("network error")) ||
    (!err.response && err.request)
  ) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet hoặc máy chủ.";
  }

  const data = err.response?.data;
  if (!data) return "Kết nối máy chủ thất bại.";
  if (Array.isArray(data.message)) return data.message.join(", ");
  return data.message || data.detail || "Đã có lỗi xảy ra. Vui lòng thử lại.";
};

export function useUserFields() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: fields = [], isLoading: isFieldsLoading } = useQuery({
    queryKey: ["user-fields"],
    queryFn: async () => {
      const res = await userFieldService.getUserFields();
      return res.data || [];
    },
  });

  const createFieldMutation = useMutation({
    mutationFn: async (payload: CreateUserFieldPayload) => {
      setError(null);
      const res = await userFieldService.createUserField(payload);
      if (!res.success) {
        throw new Error(res.message || "Tạo ruộng thất bại.");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-fields"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (err: any) => {
      setError(getErrorMessage(err));
    },
  });

  const updateFieldMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserFieldPayload;
    }) => {
      setError(null);
      const res = await userFieldService.updateUserField(id, payload);
      if (!res.success) {
        throw new Error(res.message || "Cập nhật ruộng thất bại.");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-fields"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (err: any) => {
      setError(getErrorMessage(err));
    },
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (id: string) => {
      setError(null);
      const res = await userFieldService.deleteUserField(id);
      if (!res.success) {
        throw new Error(res.message || "Xóa ruộng thất bại.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-fields"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (err: any) => {
      setError(getErrorMessage(err));
    },
  });

  const createField = async (
    payload: CreateUserFieldPayload,
    onSuccess?: () => void,
  ) => {
    try {
      await createFieldMutation.mutateAsync(payload);
      onSuccess?.();
    } catch {
      // Handled in onError
    }
  };

  const updateField = async (
    id: string,
    payload: UpdateUserFieldPayload,
    onSuccess?: () => void,
  ) => {
    try {
      await updateFieldMutation.mutateAsync({ id, payload });
      onSuccess?.();
    } catch {
      // Handled in onError
    }
  };

  const deleteField = async (id: string, onSuccess?: () => void) => {
    try {
      await deleteFieldMutation.mutateAsync(id);
      onSuccess?.();
    } catch {
      // Handled in onError
    }
  };

  return {
    fields,
    isLoading: isFieldsLoading,
    createField,
    updateField,
    deleteField,
    isCreating: createFieldMutation.isPending,
    isUpdating: updateFieldMutation.isPending,
    isDeleting: deleteFieldMutation.isPending,
    error,
    setError,
  };
}
