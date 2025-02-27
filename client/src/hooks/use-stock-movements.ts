
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useStockMovements(productId?: string) {
  return useQuery({
    queryKey: ["stock-movements", productId],
    queryFn: async () => {
      const url = productId
        ? `/api/stock-movements?productId=${productId}`
        : "/api/stock-movements";
      const data = await apiRequest(url);
      return data;
    },
  });
}
