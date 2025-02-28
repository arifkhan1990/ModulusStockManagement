import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../utils/api";
import { DialogFooter } from "../ui/dialog";
import { toast } from "react-hot-toast";

interface StockTransferFormProps {
  onSuccess?: () => void;
}

export function StockTransferForm({ onSuccess }: StockTransferFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products for dropdown
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/products?limit=100");
      return response.data.items || [];
    },
  });

  // Fetch locations for dropdown
  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/locations");
      return response.data || [];
    },
  });

  const products = productsData || [];
  const locations = locationsData || [];

  // Form schema
  const formSchema = z
    .object({
      productId: z.string({
        required_error: t("productRequired"),
      }),
      fromLocation: z.string({
        required_error: t("sourceLocationRequired"),
      }),
      toLocation: z.string({
        required_error: t("destinationLocationRequired"),
      }),
      quantity: z
        .number({
          required_error: t("quantityRequired"),
          invalid_type_error: t("quantityMustBeNumber"),
        })
        .positive({
          message: t("quantityMustBePositive"),
        }),
      notes: z.string().optional(),
    })
    .refine((data) => data.fromLocation !== data.toLocation, {
      message: t("locationsMustBeDifferent"),
      path: ["toLocation"],
    });

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      notes: "",
    },
  });

  // Submit handler
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/stock/transfer", values);
      toast.success(t("stockTransferSuccessful"));
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Stock transfer failed:", error);
      toast.error(t("stockTransferFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fromLocation")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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

          <FormField
            control={form.control}
            name="toLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("toLocation")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
        </div>

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("quantity")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
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
              <FormDescription>{t("optionalNotesForTransfer")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("processing") : t("transfer")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
