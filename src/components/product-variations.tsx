import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = ["Black", "White", "Red", "Blue", "Green", "Yellow"];

export function ProductVariations() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "variations",
    control,
  });

  const totalStock = parseInt(watch("stock") || "0");
  const variationsStock =
    watch("variations")?.reduce(
      (sum: number, variation: { stock: string }) =>
        sum + parseInt(variation.stock || "0"),
      0
    ) || 0;

  const remainingStock = totalStock - variationsStock;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Product Variations</FormLabel>
        <span
          className={`text-sm ${
            remainingStock < 0 ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          Remaining Stock: {remainingStock}
        </span>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6">
          <p className="mb-2 text-sm text-muted-foreground">
            No variations added
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ color: "", size: "", stock: "" })}
            disabled={remainingStock <= 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Variation
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[1fr,1fr,100px,40px] gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Color
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Size
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Stock
            </div>
            <div />
          </div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr,1fr,100px,40px] gap-4"
            >
              <FormField
                control={control}
                name={`variations.${index}.color`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Color" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLORS.map((color) => (
                            <SelectItem key={color} value={color.toLowerCase()}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`variations.${index}.size`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZES.map((size) => (
                            <SelectItem key={size} value={size.toLowerCase()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`variations.${index}.stock`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value || "0");
                          const otherVariationsStock =
                            variationsStock - parseInt(field.value || "0");
                          const maxAllowed = totalStock - otherVariationsStock;

                          if (newValue <= maxAllowed) {
                            field.onChange(e);
                          }
                        }}
                        max={
                          totalStock -
                          (variationsStock - parseInt(field.value || "0"))
                        }
                        min="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ color: "", size: "", stock: "" })}
            disabled={remainingStock <= 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Variation
          </Button>
        </>
      )}
    </div>
  );
}
