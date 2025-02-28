
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, TruckIcon, Mail, Phone, Edit, Trash2, Search } from "lucide-react";

// Mock data
const mockSuppliers = [
  {
    id: "1",
    name: "Tech Distributors, Inc.",
    contactName: "Michael Brown",
    email: "michael@techdist.com",
    phone: "+1 (555) 123-4567",
    address: "789 Technology Parkway, San Jose, CA 95134",
    products: ["Electronics", "Computers", "Peripherals"],
  },
  {
    id: "2",
    name: "HomeGoods Supply Co.",
    contactName: "Sarah Johnson",
    email: "sarah@homegoods.com",
    phone: "+1 (555) 987-6543",
    address: "456 Furniture Row, Grand Rapids, MI 49503",
    products: ["Furniture", "Home Decor", "Kitchenware"],
  },
  {
    id: "3",
    name: "Atlas Office Supplies",
    contactName: "David Wilson",
    email: "david@atlasoffice.com",
    phone: "+1 (555) 246-8101",
    address: "123 Commerce Street, Chicago, IL 60607",
    products: ["Office Supplies", "Paper Products", "Furniture"],
  },
  {
    id: "4",
    name: "Global Textiles Ltd.",
    contactName: "Jennifer Lee",
    email: "jennifer@globaltextiles.com",
    phone: "+1 (555) 369-1472",
    address: "321 Fabric Avenue, New York, NY 10018",
    products: ["Fabrics", "Textiles", "Clothing Materials"],
  },
];

export default function Suppliers() {
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Supplier Added",
      description: "New supplier has been added successfully.",
    });
    setIsAddDialogOpen(false);
  };

  const filteredSuppliers = mockSuppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(search.toLowerCase()) ||
      supplier.products.some((product) => product.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your product suppliers and vendors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleAddSupplier}>
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new supplier
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Enter company name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Contact Person</Label>
                      <Input id="contact-name" placeholder="Enter contact name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email address" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input id="website" placeholder="Enter website URL" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Enter full address" className="resize-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="products">Products/Services</Label>
                    <Textarea
                      id="products"
                      placeholder="Describe the products or services provided by this supplier"
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
                  <Button type="submit">Save Supplier</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>
            View and manage your supplier contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
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
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {supplier.name}
                      </div>
                    </TableCell>
                    <TableCell>{supplier.contactName}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${supplier.email}`}
                        className="flex items-center text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        {supplier.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`tel:${supplier.phone}`}
                        className="flex items-center text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {supplier.phone}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {supplier.products.map((product, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
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
