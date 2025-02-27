
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const data = await apiRequest("/api/suppliers");
      return data;
    },
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: async () => {
      if (!id) return null;
      const data = await apiRequest(`/api/suppliers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
