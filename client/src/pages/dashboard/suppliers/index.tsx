
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
import { Plus, Phone, Mail, Search } from "lucide-react";

// Mock data until API is implemented
const mockSuppliers = [
  {
    id: 1,
    code: "SUP-001",
    name: "TechGear Supplies Inc.",
    contact: "John Miller",
    email: "john@techgear.com",
    phone: "+1 (555) 123-4567",
    productCount: 32,
    status: "Active",
  },
  {
    id: 2,
    code: "SUP-002",
    name: "Global Electronics Ltd.",
    contact: "Sarah Johnson",
    email: "sarah@globalelectronics.com",
    phone: "+1 (555) 987-6543",
    productCount: 47,
    status: "Active",
  },
  {
    id: 3,
    code: "SUP-003",
    name: "QuickShip Distribution",
    contact: "Mike Brown",
    email: "mike@quickship.com",
    phone: "+1 (555) 456-7890",
    productCount: 19,
    status: "Inactive",
  },
];

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter suppliers based on search term
  const filteredSuppliers = mockSuppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your product suppliers and vendor relationships
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>
            View and manage your product suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Email/Phone</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.code}</TableCell>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{supplier.productCount}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          supplier.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {supplier.status}
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
