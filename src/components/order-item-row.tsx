import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/product";

interface OrderItemRowProps {
  index: number;
  products: Product[];
  onRemove: () => void;
}

export function OrderItemRow({ index, products, onRemove }: OrderItemRowProps) {
  const { control, watch, setValue } = useFormContext();
  const selectedProductId = watch(`items.${index}.productId`);

  const selectedProduct = products.find(
    (p) => p.id.toString() === selectedProductId
  );

  return (
    <div className="grid grid-cols-[1fr,1fr,100px,100px,40px] gap-4">
      <FormField
        control={control}
        name={`items.${index}.productId`}
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                const product = products.find((p) => p.id.toString() === value);
                setValue(
                  `items.${index}.price`,
                  product?.price.toString() || ""
                );
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`items.${index}.variationId`}
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                const variation = selectedProduct?.variations?.find(
                  (v) => v.id.toString() === value
                );
                setValue(
                  `items.${index}.price`,
                  variation?.price.toString() ||
                    selectedProduct?.price.toString() ||
                    ""
                );
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select variation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {selectedProduct?.variations?.map((variation) => (
                  <SelectItem
                    key={variation.id}
                    value={variation.id.toString()}
                  >
                    {`${variation.color} - ${variation.size}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`items.${index}.quantity`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" min="1" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`items.${index}.price`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
