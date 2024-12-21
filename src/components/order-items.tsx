import { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import { OrderItemRow } from "@/components/order-item-row";

export function OrderItems() {
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
            id,
            name,
            price,
            stock,
            status,
            sku,
            cost,
            category,
            description,
            variations (
              id,
              product_id,
              color,
              size,
              stock,
              price
            )
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
