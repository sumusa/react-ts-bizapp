import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldArray, useFormContext } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { OrderItemRow } from "@/components/order-item-row";
import { Product } from "@/types/product";

const orderFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  status: z.enum(["Processing", "Shipped", "Delivered", "Cancelled"]),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product is required"),
      quantity: z.string().min(1, "Quantity is required"),
      price: z.string().min(1, "Price is required"),
      variationId: z.string().optional(),
    })
  ),
});

const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Cash"];

function OrderItems() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            variations (*)
          `
          )
          .eq("status", "In Stock");

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const calculateTotal = () => {
    return fields.reduce((sum, _, index) => {
      const quantity = parseInt(watch(`items.${index}.quantity`) || "0");
      const price = parseFloat(watch(`items.${index}.price`) || "0");
      return sum + quantity * price;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Order Items</FormLabel>
        <span className="text-sm font-medium">
          Total: ${calculateTotal().toFixed(2)}
        </span>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6">
          <p className="mb-2 text-sm text-muted-foreground">No items added</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                productId: "",
                variationId: "",
                quantity: "",
                price: "",
              })
            }
            disabled={loading || products.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[1fr,1fr,100px,100px,40px] gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Product
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Variation
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Quantity
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Price
            </div>
            <div />
          </div>

          {fields.map((field, index) => (
            <OrderItemRow
              key={field.id}
              index={index}
              products={products}
              onRemove={() => remove(index)}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                productId: "",
                variationId: "",
                quantity: "",
                price: "",
              })
            }
            disabled={loading || products.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Item
          </Button>
        </>
      )}
    </div>
  );
}

export function AddOrderDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      shippingAddress: "",
      billingAddress: "",
      paymentMethod: "",
      status: "Processing",
      items: [],
    },
  });

  async function onSubmit(values: z.infer<typeof orderFormSchema>) {
    try {
      // First, create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: values.customerName,
            email: values.email,
            phone: values.phone,
            shipping_address: values.shippingAddress,
            billing_address: values.billingAddress,
            payment_method: values.paymentMethod,
            status: values.status,
            total: values.items.reduce((sum, item) => {
              return sum + parseFloat(item.price) * parseInt(item.quantity);
            }, 0),
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Then, create the order items
      const orderItems = values.items.map((item) => ({
        order_id: order.id,
        product_id: parseInt(item.productId),
        variation_id: item.variationId ? parseInt(item.variationId) : null,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of values.items) {
        const { error: stockError } = await supabase.rpc(
          "update_product_stock",
          {
            p_id: parseInt(item.productId),
            v_id: item.variationId ? parseInt(item.variationId) : null,
            qty: parseInt(item.quantity),
          }
        );

        if (stockError) throw stockError;
      }

      form.reset();
      setOpen(false);
      toast.success("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error creating order. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method.toLowerCase()}>
                            {method}
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
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shipping address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter billing address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Order Items</FormLabel>
              <OrderItems />
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
                Add Order
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
