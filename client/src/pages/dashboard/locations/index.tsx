
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, MapPin } from "lucide-react";

// Mock data until API is implemented
const mockLocations = [
  {
    id: 1,
    code: "WH-MAIN",
    name: "Main Warehouse",
    type: "Warehouse",
    address: "123 Distribution Ave, Portland, OR",
    productCount: 142,
    status: "Active",
  },
  {
    id: 2,
    code: "STORE-001",
    name: "Downtown Store",
    type: "Retail Store",
    address: "456 Main St, Portland, OR",
    productCount: 98,
    status: "Active",
  },
  {
    id: 3,
    code: "ONLINE",
    name: "Online Store",
    type: "Virtual",
    address: "N/A",
    productCount: 134,
    status: "Active",
  },
];

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter locations based on search term
  const filteredLocations = mockLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage your warehouses, stores, and other inventory locations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
          <CardDescription>
            View and manage all your inventory locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>{location.code}</TableCell>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{location.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {location.address !== "N/A" && (
                          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        )}
                        {location.address}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{location.productCount}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {location.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
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
