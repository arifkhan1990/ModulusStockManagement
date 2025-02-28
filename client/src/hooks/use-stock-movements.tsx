
import { useQuery } from "@tanstack/react-query";

// Mock data - replace with actual API calls
const mockMovements = [
  {
    id: "1",
    date: new Date("2023-06-15T14:30:00"),
    type: "transfer",
    product: "Wireless Headphones",
    fromLocation: "Main Warehouse",
    toLocation: "Downtown Store",
    quantity: 5,
    reference: "TRF-001",
    createdBy: "John Doe",
  },
  {
    id: "2",
    date: new Date("2023-06-14T11:15:00"),
    type: "adjustment",
    product: "Bluetooth Speaker",
    fromLocation: "Main Warehouse",
    toLocation: null,
    quantity: -2,
    reference: "ADJ-001",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    date: new Date("2023-06-14T09:45:00"),
    type: "transfer",
    product: "Smartphone Charger",
    fromLocation: "South Fulfillment",
    toLocation: "Downtown Store",
    quantity: 10,
    reference: "TRF-002",
    createdBy: "John Doe",
  },
  {
    id: "4",
    date: new Date("2023-06-13T16:20:00"),
    type: "adjustment",
    product: "Desk Lamp",
    fromLocation: "West Coast Distribution",
    toLocation: null,
    quantity: 3,
    reference: "ADJ-002",
    createdBy: "Jane Smith",
  },
  {
    id: "5",
    date: new Date("2023-06-12T13:30:00"),
    type: "transfer",
    product: "Coffee Mug",
    fromLocation: "Main Warehouse",
    toLocation: "Downtown Store",
    quantity: 15,
    reference: "TRF-003",
    createdBy: "John Doe",
  },
];

export function useStockMovements() {
  return useQuery({
    queryKey: ['stockMovements'],
    queryFn: async () => {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMovements;
    },
  });
}
