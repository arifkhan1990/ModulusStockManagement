
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const data = await apiRequest("/api/locations");
      return data;
    },
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ["locations", id],
    queryFn: async () => {
      if (!id) return null;
      const data = await apiRequest(`/api/locations/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
