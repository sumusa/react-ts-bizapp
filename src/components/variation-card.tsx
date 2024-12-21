import { ProductVariation } from "@/types/product";

import { Badge } from "./ui/badge";

export function VariationCard({ variation }: { variation: ProductVariation }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center space-x-4">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: variation.color }}
        />
        <div>
          <p className="font-medium">
            {variation.color} - {variation.size}
          </p>
          <p className="text-sm text-muted-foreground">
            Stock: {variation.stock} units
          </p>
        </div>
      </div>
      <Badge variant={variation.stock <= 5 ? "destructive" : "default"}>
        {variation.stock <= 5 ? "Low Stock" : "In Stock"}
      </Badge>
    </div>
  );
}
