import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { ConfigCreatePayload, ConfigUpdatePayload } from "@/types/admin.type";

export function useAdminConfigs() {
  const queryClient = useQueryClient();

  const configsQuery = useQuery({
    queryKey: ["adminConfigs"],
    queryFn: () => adminService.getConfigs(),
  });

  const addConfigMutation = useMutation({
    mutationFn: (payload: ConfigCreatePayload) =>
      adminService.addConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConfigs"] });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({
      key,
      payload,
    }: {
      key: string;
      payload: ConfigUpdatePayload;
    }) => adminService.updateConfig(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConfigs"] });
    },
  });

  return {
    configs: configsQuery.data,
    isLoading: configsQuery.isLoading,
    isError: configsQuery.isError,
    error: configsQuery.error,
    refetch: configsQuery.refetch,
    addConfig: addConfigMutation.mutateAsync,
    isAdding: addConfigMutation.isPending,
    updateConfig: updateConfigMutation.mutateAsync,
    isUpdating: updateConfigMutation.isPending,
  };
}
