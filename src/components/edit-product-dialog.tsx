import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { supabase } from "@/lib/supabase";
import { ProductVariations } from "./product-variations";
import { Product } from "@/types/product";

const categories = [
  "Apparel",
  "Accessories",
  "Books",
  "Art",
  "Home & Living",
  "Digital",
];

const productFormSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    sku: z.string().min(1, "SKU is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    price: z.string().min(1, "Price is required"),
    cost: z.string().min(1, "Cost is required"),
    stock: z.string().min(1, "Stock is required"),
    variations: z
      .array(
        z.object({
          color: z.string().min(1, "Color is required"),
          size: z.string().min(1, "Size is required"),
          stock: z.string().min(1, "Stock is required"),
        })
      )
      .default([]),
  })
  .refine(
    (data) => {
      const totalStock = parseInt(data.stock);
      const variationsStock = data.variations.reduce(
        (sum, variation) => sum + parseInt(variation.stock),
        0
      );
      return variationsStock <= totalStock;
    },
    {
      message: "Total variations stock cannot exceed product stock",
      path: ["variations"],
    }
  );

export function EditProductDialog({
  product,
  onProductUpdated,
  children,
}: {
  product: Product;
  onProductUpdated: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost?.toString() ?? "0",
      stock: product.stock.toString(),
      variations: product.variations?.map((v) => ({
        color: v.color,
        size: v.size,
        stock: v.stock.toString(),
      })),
    },
  });

  useEffect(() => {
    async function fetchVariations() {
      if (!open) return;

      try {
        const { data, error } = await supabase
          .from("product_variations")
          .select("*")
          .eq("product_id", product.id);

        if (error) throw error;

        form.setValue(
          "variations",
          data?.map((v) => ({
            color: v.color,
            size: v.size,
            stock: v.stock.toString(),
          })) || []
        );
      } catch (error) {
        console.error("Error fetching variations:", error);
        toast.error("Failed to load product variations");
      }
    }

    fetchVariations();
  }, [open, product.id, form]);

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    try {
      const formattedData = {
        name: values.name,
        sku: values.sku,
        description: values.description,
        category: values.category,
        price: parseFloat(values.price),
        cost: parseFloat(values.cost),
        stock: parseInt(values.stock),
        status: parseInt(values.stock) <= 5 ? "Low Stock" : "In Stock",
      };

      const { error: productError } = await supabase
        .from("products")
        .update(formattedData)
        .eq("id", product.id);

      if (productError) throw productError;

      // Delete existing variations
      await supabase
        .from("product_variations")
        .delete()
        .eq("product_id", product.id);

      if (values.variations && values.variations.length > 0) {
        const variations = (values.variations ?? []).map((variation) => ({
          product_id: product.id,
          color: variation.color,
          size: variation.size,
          stock: parseInt(variation.stock),
        }));

        const { error: variationError } = await supabase
          .from("product_variations")
          .insert(variations);

        if (variationError) throw variationError;
      }

      setOpen(false);
      onProductUpdated();
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category.toLowerCase()}
                          >
                            {category}
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
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter stock quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter cost"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Product Variations</FormLabel>
              <ProductVariations />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Product
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
