
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Mock data for demo purposes
const mockProducts = [
  { id: "1", name: "Wireless Headphones" },
  { id: "2", name: "Smartphone Charger" },
  { id: "3", name: "Bluetooth Speaker" },
  { id: "4", name: "Desk Lamp" },
  { id: "5", name: "Coffee Mug" },
];

const mockLocations = [
  { id: "1", name: "Main Warehouse" },
  { id: "2", name: "Downtown Store" },
  { id: "3", name: "West Coast Distribution" },
  { id: "4", name: "South Fulfillment" },
  { id: "5", name: "Pop-up Shop" },
];

// Define schema for form validation
const formSchema = z.object({
  type: z.enum(["transfer", "adjustment"]),
  productId: z.string().min(1, "Please select a product"),
  fromLocationId: z.string().min(1, "Please select a source location"),
  toLocationId: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  reference: z.string().optional(),
  reason: z.string().optional(),
});

// Type for form values
type MovementFormValues = z.infer<typeof formSchema>;

interface StockTransferFormProps {
  onSuccess?: () => void;
}

export function StockTransferForm({ onSuccess }: StockTransferFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [movementType, setMovementType] = useState("transfer");

  const defaultValues = {
    productId: "",
    fromLocationId: "",
    toLocationId: "",
    quantity: 1,
    type: "transfer",
    reference: "",
    reason: "",
  };

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update form when movement type changes
  const watchedType = form.watch("type");
  if (watchedType !== movementType) {
    setMovementType(watchedType);
    // Clear destination location if movement type is adjustment
    if (watchedType === "adjustment") {
      form.setValue("toLocationId", "");
    }
  }

  async function onSubmit(values: MovementFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Stock movement values:", values);
      
      toast({
        title: values.type === "transfer" ? "Stock Transferred" : "Stock Adjusted",
        description: "The stock movement has been recorded successfully.",
      });
      
      form.reset(defaultValues);
      if (onSuccess) onSuccess();
      
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movement Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select movement type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="transfer">Transfer (Between Locations)</SelectItem>
                  <SelectItem value="adjustment">Adjustment (Add/Remove Stock)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose whether you're transferring stock between locations or adjusting quantity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fromLocationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {movementType === "transfer" ? "From Location" : "Location"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {movementType === "transfer" && (
            <FormField
              control={form.control}
              name="toLocationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockLocations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  {movementType === "adjustment" && (
                    <>Use negative numbers to remove stock</>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Order number, invoice, etc."
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional reference number or identifier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Reason for the stock movement"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {movementType === "adjustment"
                  ? "Explain why this adjustment is needed (e.g., damaged goods, stocktake correction)"
                  : "Optional notes about this transfer"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Processing..." : "Submit Stock Movement"}
        </Button>
      </form>
    </Form>
  );
}
