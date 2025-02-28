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
import { Plus, MapPin, Edit, Trash2, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Mock data
const mockLocations = [
  {
    id: "1",
    name: "Main Warehouse",
    type: "Warehouse",
    address: "123 Storage Ave, New York, NY 10001",
    contactNumber: "+1 (555) 123-4567",
    isActive: true,
  },
  {
    id: "2",
    name: "Downtown Store",
    type: "Store",
    address: "456 Retail St, New York, NY 10002",
    contactNumber: "+1 (555) 987-6543",
    isActive: true,
  },
  {
    id: "3",
    name: "West Coast Distribution",
    type: "Distribution Center",
    address: "789 Logistics Blvd, Los Angeles, CA 90001",
    contactNumber: "+1 (555) 246-8101",
    isActive: true,
  },
  {
    id: "4",
    name: "South Fulfillment",
    type: "Fulfillment Center",
    address: "321 Shipping Lane, Miami, FL 33101",
    contactNumber: "+1 (555) 369-1472",
    isActive: false,
  },
  {
    id: "5",
    name: "Pop-up Shop",
    type: "Temporary Storage",
    address: "555 Event Plaza, Chicago, IL 60601",
    contactNumber: "+1 (555) 258-3690",
    isActive: true,
  },
];

const locationTypes = [
  "Warehouse",
  "Store",
  "Distribution Center",
  "Fulfillment Center",
  "Retail Shop",
  "Dropship Location",
  "Production Facility",
  "Temporary Storage",
  "Other",
];

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.string().min(1, { message: "Please select a location type." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  contactNumber: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function Locations() {
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      type: "",
      address: "",
      contactNumber: "",
      isActive: true,
    },
  });

  const handleAddLocation = (values: FormValues) => {
    toast({
      title: "Location Added",
      description: "New location has been added successfully.",
    });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const filteredLocations = mockLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.type.toLowerCase().includes(search.toLowerCase()) ||
      location.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage warehouses, stores, and other inventory locations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={form.handleSubmit(handleAddLocation)}>
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new inventory location
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter location name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter full address"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter contact number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>
                              Inactive locations will not be available for stock
                              movements
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Location</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
          <CardDescription>
            View and manage your inventory locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {location.name}
                      </div>
                    </TableCell>
                    <TableCell>{location.type}</TableCell>
                    <TableCell>{location.address}</TableCell>
                    <TableCell>{location.contactNumber}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          location.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {location.isActive ? "Active" : "Inactive"}
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
