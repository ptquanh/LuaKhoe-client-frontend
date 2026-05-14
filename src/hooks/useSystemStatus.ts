import { useQuery } from "@tanstack/react-query";

import { systemService } from "@/services/system.service";

export function useSystemStatus() {
  return useQuery({
    queryKey: ["systemStatus"],
    queryFn: () => systemService.getStatus(),
    refetchInterval: 30000, // Polling mỗi 30s
  });
}
