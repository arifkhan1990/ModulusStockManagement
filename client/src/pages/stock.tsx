import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Plus, FileBarChart } from "lucide-react";
import { format } from "date-fns";

// Mock data
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

export default function StockPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Stock Management
          </h1>
          <p className="text-muted-foreground">
            Transfer stock between locations and track movements
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                New Stock Movement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
                <DialogDescription>
                  Transfer stock between locations or record adjustments
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-muted-foreground">
                  Stock movement form will go here
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <FileBarChart className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="movements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="levels">Stock Levels</TabsTrigger>
        </TabsList>
        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>
                View history of all stock transfers and adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        <TableCell>
                          <Badge
                            variant={
                              movement.type === "transfer"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {movement.type === "transfer"
                              ? "Transfer"
                              : "Adjustment"}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.product}</TableCell>
                        <TableCell>{movement.fromLocation}</TableCell>
                        <TableCell>{movement.toLocation || "—"}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              movement.quantity > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {movement.quantity > 0
                              ? `+${movement.quantity}`
                              : movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{movement.reference}</TableCell>
                        <TableCell>{movement.createdBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="levels">
          <Card>
            <CardHeader>
              <CardTitle>Current Stock Levels</CardTitle>
              <CardDescription>
                View current stock levels across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 border rounded-md bg-muted/10">
                <p className="text-center text-muted-foreground">
                  Stock levels table will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
