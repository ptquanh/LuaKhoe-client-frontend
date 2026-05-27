import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CreateNutritionChunkPayload,
  nutritionService,
} from "@/services/nutrition.service";

export function useNutritionChunks(params: {
  limit: number;
  offset: number;
  keyword?: string;
  source?: string;
  format?: string;
}) {
  const queryClient = useQueryClient();

  const chunksQuery = useQuery({
    queryKey: ["nutritionChunks", params],
    queryFn: () => nutritionService.getChunks(params),
  });

  const createChunkMutation = useMutation({
    mutationFn: (payload: CreateNutritionChunkPayload) =>
      nutritionService.createChunk(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionChunks"] });
    },
  });

  const deleteChunkMutation = useMutation({
    mutationFn: (id: string) => nutritionService.deleteChunk(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionChunks"] });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => nutritionService.uploadFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionChunks"] });
    },
  });

  return {
    chunksData: chunksQuery.data?.data,
    isLoading: chunksQuery.isLoading,
    isError: chunksQuery.isError,
    refetch: chunksQuery.refetch,
    createChunk: createChunkMutation.mutateAsync,
    isCreating: createChunkMutation.isPending,
    deleteChunk: deleteChunkMutation.mutateAsync,
    isDeleting: deleteChunkMutation.isPending,
    uploadFile: uploadFileMutation.mutateAsync,
    isUploading: uploadFileMutation.isPending,
  };
}
