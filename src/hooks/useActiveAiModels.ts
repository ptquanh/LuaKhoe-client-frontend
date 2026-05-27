import { useQuery } from "@tanstack/react-query";

import { aiModelService } from "@/services/ai-model.service";

export function useActiveAiModels() {
  return useQuery({
    queryKey: ["activeAiModels"],
    queryFn: async () => {
      const response = await aiModelService.getActiveModels();
      return response.data || [];
    },
  });
}
