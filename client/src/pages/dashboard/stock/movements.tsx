
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { ArrowRightLeft, FileBarChart } from "lucide-react";

// Mock data until API is implemented
const mockMovements = [
  {
    id: 1,
    date: new Date(),
    type: "Transfer",
    productName: "Wireless Headphones",
    fromLocation: "Main Warehouse",
    toLocation: "Online Store",
    quantity: 25,
    reference: "TRF-001",
    createdBy: "John Smith",
  },
  {
    id: 2,
    date: new Date(Date.now() - 86400000),
    type: "Adjustment",
    productName: "Smart Watch",
    fromLocation: "Main Warehouse",
    toLocation: "-",
    quantity: -5,
    reference: "ADJ-002",
    createdBy: "Jane Doe",
  },
];

export default function StockMovementsPage() {
  const [productFilter, setProductFilter] = useState("");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Movements</h1>
          <p className="text-muted-foreground">
            Track and manage all stock movements between locations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            New Movement
          </Button>
          <Button variant="outline">
            <FileBarChart className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
          <CardDescription>
            View history of all stock transfers and adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="w-full md:w-64">
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="1">Wireless Headphones</SelectItem>
                  <SelectItem value="2">Smart Watch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {format(movement.date, "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>{movement.type}</TableCell>
                    <TableCell>{movement.productName}</TableCell>
                    <TableCell>{movement.fromLocation}</TableCell>
                    <TableCell>{movement.toLocation}</TableCell>
                    <TableCell className="text-right">{movement.quantity}</TableCell>
                    <TableCell>{movement.reference}</TableCell>
                    <TableCell>{movement.createdBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
