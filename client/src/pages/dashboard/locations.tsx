import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";

// Mock data for demonstration
const mockLocations = [
  {
    id: "1",
    name: "Main Warehouse",
    address: "123 Industrial Park, New York, NY",
    type: "Warehouse",
    status: "Active",
    productCount: 287
  },
  {
    id: "2",
    name: "Downtown Store",
    address: "456 Main Street, New York, NY",
    type: "Retail",
    status: "Active",
    productCount: 124
  },
  {
    id: "3",
    name: "West Coast Distribution",
    address: "789 Pacific Ave, Los Angeles, CA",
    type: "Distribution",
    status: "Active",
    productCount: 346
  },
  {
    id: "4",
    name: "North Campus Store",
    address: "101 University Blvd, Boston, MA",
    type: "Retail",
    status: "Active",
    productCount: 98
  },
  {
    id: "5",
    name: "Old Storage Facility",
    address: "202 Storage Lane, Chicago, IL",
    type: "Warehouse",
    status: "Inactive",
    productCount: 12
  }
];

export default function Locations() {
  const [locations] = useState(mockLocations);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage your inventory locations
          </p>
        </div>
        <Button className="md:w-auto w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Locations</CardTitle>
          <CardDescription>
            View and manage all your inventory locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{location.address}</TableCell>
                    <TableCell>{location.type}</TableCell>
                    <TableCell>
                      <Badge variant={location.status === "Active" ? "default" : "secondary"}>
                        {location.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{location.productCount}</TableCell>
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