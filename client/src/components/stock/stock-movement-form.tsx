
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertStockMovementSchema } from "@shared/schema";
import { z } from "zod";
import { useAuth } from "@/providers/auth-provider";
import { useProducts } from "@/hooks/use-products";
import { useLocations } from "@/hooks/use-locations";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = insertStockMovementSchema.extend({
  createdBy: z.string(),
});

type MovementFormValues = z.infer<typeof formSchema>;

interface StockMovementFormProps {
  onSuccess?: () => void;
}

export function StockMovementForm({ onSuccess }: StockMovementFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: locations = [] } = useLocations();
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
    createdBy: user?._id || "",
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

  const stockMovementMutation = useMutation({
    mutationFn: async (data: MovementFormValues) => {
      return apiRequest("/api/stock-movements", {
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      toast({
        title: "Stock movement recorded",
        description: "The inventory has been updated successfully.",
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error: any) => {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create stock movement. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function onSubmit(data: MovementFormValues) {
    setIsLoading(true);
    stockMovementMutation.mutate({
      ...data,
      quantity: Number(data.quantity),
      createdBy: user?._id || "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Movement Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="transfer" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Transfer (between locations)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="adjustment" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Adjustment (write-off, damage, etc.)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name} ({product.sku})
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromLocationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Location</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location._id} value={location._id}>
                        {location.name} ({location.type})
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
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations
                        .filter((l) => l._id !== form.getValues().fromLocationId)
                        .map((location) => (
                          <SelectItem key={location._id} value={location._id}>
                            {location.name} ({location.type})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Record Stock Movement"}
        </Button>
      </form>
    </Form>
  );
}
