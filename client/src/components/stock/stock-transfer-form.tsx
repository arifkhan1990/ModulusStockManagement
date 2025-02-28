import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Mock data - replace with real API calls
const mockProducts = [
  { id: "1", name: "Wireless Headphones" },
  { id: "2", name: "Bluetooth Speaker" },
  { id: "3", name: "Smartphone Charger" },
  { id: "4", name: "Desk Lamp" },
  { id: "5", name: "Coffee Mug" },
];

const mockLocations = [
  { id: "1", name: "Main Warehouse" },
  { id: "2", name: "Downtown Store" },
  { id: "3", name: "West Coast Distribution" },
  { id: "4", name: "South Fulfillment" },
];

const formSchema = z.object({
  type: z.enum(["transfer", "adjustment"], {
    required_error: "Please select a movement type",
  }),
  productId: z.string({
    required_error: "Please select a product",
  }),
  fromLocationId: z.string({
    required_error: "Please select a source location",
  }),
  toLocationId: z.string().optional(),
  quantity: z.coerce
    .number()
    .int()
    .positive({
      message: "Quantity must be a positive number",
    }),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export function StockTransferForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "transfer",
      quantity: 1,
    },
  });

  const movementType = form.watch("type");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      // Mock API call - replace with real implementation
      console.log("Submitting stock movement:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      toast({
        title: values.type === "transfer" ? "Stock Transferred" : "Stock Adjusted",
        description: "The stock movement has been recorded successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating stock movement:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movement Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select movement type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Transfer moves stock between locations, adjustment changes stock levels
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
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
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

        <FormField
          control={form.control}
          name="fromLocationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Location</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source location" />
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
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination location" />
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
                  min={1}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="REF-001" {...field} />
              </FormControl>
              <FormDescription>
                Add a reference number for tracking purposes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional information about this stock movement"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Record Movement
          </Button>
        </div>
      </form>
    </Form>
  );
}
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../utils/api';
import { useToast } from '../ui/use-toast';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  type: z.enum(["transfer", "adjustment"], {
    required_error: "Please select a movement type",
  }),
  productId: z.string({
    required_error: "Please select a product",
  }),
  fromLocationId: z.string({
    required_error: "Please select a source location",
  }),
  toLocationId: z.string().optional(),
  quantity: z.coerce
    .number()
    .int()
    .positive({
      message: "Quantity must be a positive number",
    }),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export function StockTransferForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "transfer",
      quantity: 1,
    },
  });

  const movementType = form.watch("type");

  // Fetch products for dropdown
  const { data: products = [] } = useQuery({
    queryKey: ["products-dropdown"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/products?limit=100");
        return response.data?.products || [];
      } catch (error) {
        console.error("Failed to fetch products", error);
        return [];
      }
    },
    placeholderData: Array(10).fill(0).map((_, i) => ({
      _id: `product-${i}`,
      name: `Product ${i + 1}`,
    })),
  });

  // Fetch locations for dropdown
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/locations");
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch locations", error);
        return [];
      }
    },
    placeholderData: [
      { _id: "loc1", name: "Main Warehouse" },
      { _id: "loc2", name: "Store 1" },
      { _id: "loc3", name: "Store 2" },
    ],
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // Call the API to create stock movement
      await apiRequest("POST", "/api/stock-movements", {
        ...values,
        createdBy: user?._id,
      });

      toast({
        title: values.type === "transfer" ? t("stockTransferred") : t("stockAdjusted"),
        description: t("stockMovementRecorded"),
      });

      form.reset({
        type: "transfer",
        quantity: 1,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to submit stock movement", error);
      toast({
        title: t("error"),
        description: t("failedToRecordStockMovement"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t("movementType")}</FormLabel>
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
                    <FormLabel className="font-normal cursor-pointer">
                      {t("transfer")}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="adjustment" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t("adjustment")}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                {movementType === "transfer"
                  ? t("transferStockBetweenLocations")
                  : t("adjustStockDueToDamageOrDiscrepancy")}
              </FormDescription>
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
                <FormLabel>{t("product")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectProduct")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((product: any) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name}
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
                <FormLabel>{t("quantity")}</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
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
                <FormLabel>{t("fromLocation")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectLocation")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location: any) => (
                      <SelectItem key={location._id} value={location._id}>
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
                  <FormLabel>{t("toLocation")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectLocation")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location: any) => (
                        <SelectItem key={location._id} value={location._id}>
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
        </div>

        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reference")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t("optionalReferenceNumber")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("notes")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("processing") : t("submitMovement")}
        </Button>
      </form>
    </Form>
  );
}
