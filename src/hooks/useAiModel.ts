import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { aiModelService } from "@/services/ai-model.service";

export function useAiModel(params?: {
  limit?: number;
  offset?: number;
  sort?: string;
}) {
  const queryClient = useQueryClient();

  const modelsQuery = useQuery({
    queryKey: ["aiModels", params],
    queryFn: async () => {
      const response = await aiModelService.getAllModels(params);
      return response.data;
    },
  });

  const uploadModelMutation = useMutation({
    mutationFn: (payload: FormData) => aiModelService.createModel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiModels"] });
      queryClient.invalidateQueries({ queryKey: ["activeAiModels"] });
    },
  });

  const activateModelMutation = useMutation({
    mutationFn: (id: string) => aiModelService.setActiveModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiModels"] });
      queryClient.invalidateQueries({ queryKey: ["activeAiModels"] });
    },
  });

  const deleteModelMutation = useMutation({
    mutationFn: (id: string) => aiModelService.deleteModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiModels"] });
      queryClient.invalidateQueries({ queryKey: ["activeAiModels"] });
    },
  });

  const updateModelMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      aiModelService.updateModel(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiModels"] });
      queryClient.invalidateQueries({ queryKey: ["activeAiModels"] });
    },
  });

  return {
    modelsData: modelsQuery.data,
    isLoading: modelsQuery.isLoading,
    isError: modelsQuery.isError,
    refetch: modelsQuery.refetch,
    uploadModel: uploadModelMutation.mutateAsync,
    isUploading: uploadModelMutation.isPending,
    activateModel: activateModelMutation.mutateAsync,
    isActivating: activateModelMutation.isPending,
    deleteModel: deleteModelMutation.mutateAsync,
    isDeleting: deleteModelMutation.isPending,
    updateModel: updateModelMutation.mutateAsync,
    isUpdating: updateModelMutation.isPending,
  };
}
