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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

// Mock data
const mockProducts = [
  {
    id: "1",
    sku: "PROD-001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 129.99,
    quantity: 45,
    status: "In Stock",
  },
  {
    id: "2",
    sku: "PROD-002",
    name: "Smartphone Charger",
    category: "Electronics",
    price: 24.99,
    quantity: 12,
    status: "Low Stock",
  },
  {
    id: "3",
    sku: "PROD-003",
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 89.99,
    quantity: 30,
    status: "In Stock",
  },
  {
    id: "4",
    sku: "PROD-004",
    name: "Desk Lamp",
    category: "Home",
    price: 49.99,
    quantity: 20,
    status: "In Stock",
  },
  {
    id: "5",
    sku: "PROD-005",
    name: "Coffee Mug",
    category: "Kitchen",
    price: 14.99,
    quantity: 5,
    status: "Low Stock",
  },
];

export default function Products() {
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product Added",
      description: "New product has been added successfully.",
    });
    setIsAddDialogOpen(false);
  };

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()),
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-amber-100 text-amber-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleAddProduct}>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input id="sku" placeholder="PROD-XXX" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" placeholder="Product name" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="initial-stock">Initial Stock</Label>
                      <Input
                        id="initial-stock"
                        type="number"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-stock">Minimum Stock Level</Label>
                      <Input
                        id="min-stock"
                        type="number"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Product description"
                      className="resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Product</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            View and manage your entire product inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.quantity}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(
                          product.status,
                        )}`}
                      >
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
