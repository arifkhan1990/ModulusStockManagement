import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { StockTransferForm } from "@/components/stock/stock-transfer-form";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Product {
  id: number;
  name: string;
}

export default function StockMovementsPage() {
  const [productFilter, setProductFilter] = useState("");

  const { data: movements = [] } = useQuery({
    queryKey: ["stock-movements", productFilter],
    queryFn: async () => {
      const url = productFilter
        ? `/api/stock-movements?productId=${productFilter}`
        : "/api/stock-movements";
      const response = await apiRequest("GET", url);
      return response.json();
    },
  });

  // Get products for dropdown
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/products");
      return res.json();
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Movements</h1>
          <p className="text-muted-foreground">
            Manage stock transfers and adjustments
          </p>
        </div>
      </div>

      <Tabs defaultValue="movements">
        <TabsList>
          <TabsTrigger value="new">New Movement</TabsTrigger>
          <TabsTrigger value="movements">Movement History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Record Stock Movement</CardTitle>
              <CardDescription>
                Transfer stock between locations or record adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockTransferForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
              <CardDescription>
                View all stock transfers and adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Select
                  value={productFilter}
                  onValueChange={setProductFilter}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Filter by product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Products</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {productFilter && (
                  <Button
                    variant="ghost"
                    onClick={() => setProductFilter("")}
                  >
                    Clear
                  </Button>
                )}
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
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No stock movements found
                        </TableCell>
                      </TableRow>
                    ) : (
                      movements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>
                            {format(new Date(movement.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`capitalize ${
                                movement.type === "adjustment"
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }`}
                            >
                              {movement.type}
                            </span>
                          </TableCell>
                          <TableCell>
                            {movement.product?.name || movement.productId}
                          </TableCell>
                          <TableCell>
                            {movement.fromLocation?.name ||
                              movement.fromLocationId ||
                              "N/A"}
                          </TableCell>
                          <TableCell>
                            {movement.toLocation?.name ||
                              movement.toLocationId ||
                              "N/A"}
                          </TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.reference || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}