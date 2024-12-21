import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ProductVariation } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Stat } from "@/components/ui/stat";
import { VariationCard } from "./variation-card";

interface ProductDetailsDialogProps {
  product: {
    id: number;
    name: string;
    sku: string;
    description?: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    status: string;
    variations?: ProductVariation[];
  };
  children: React.ReactNode;
}

function LoadingVariations() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-16 rounded-lg border border-muted animate-pulse bg-muted/10"
        />
      ))}
    </div>
  );
}

function EmptyVariations() {
  return (
    <div className="text-center py-6 text-muted-foreground">
      No variations available for this product
    </div>
  );
}

export function ProductDetailsDialog({
  product,
  children,
}: ProductDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const profit = product.price - product.cost;
  const profitMargin = ((profit / product.price) * 100).toFixed(2);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    async function fetchVariations() {
      if (!open) return;
      try {
        const { data, error } = await supabase
          .from("product_variations")
          .select("*")
          .eq("product_id", product.id);

        if (error) throw error;
        setVariations(data || []);
      } catch (error) {
        console.error("Error fetching variations:", error);
        toast.error("Failed to load product variations");
      } finally {
        setLoading(false);
      }
    }

    fetchVariations();
  }, [product.id, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{product.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                SKU: {product.sku}
              </p>
            </div>
            <Badge
              variant={
                product.status === "Low Stock" ? "destructive" : "default"
              }
              className="ml-2"
            >
              {product.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex space-x-4 border-b">
          <Button
            variant={activeTab === "details" ? "default" : "ghost"}
            className="relative px-4"
            onClick={() => setActiveTab("details")}
          >
            Details
            {activeTab === "details" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Button>
          <Button
            variant={activeTab === "variations" ? "default" : "ghost"}
            className="relative px-4"
            onClick={() => setActiveTab("variations")}
          >
            Variations ({variations.length})
            {activeTab === "variations" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Button>
        </div>

        {activeTab === "details" ? (
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <Stat
                      label="Price"
                      value={`$${product.price.toFixed(2)}`}
                    />
                    <Stat label="Cost" value={`$${product.cost.toFixed(2)}`} />
                    <Stat label="Profit" value={`$${profit.toFixed(2)}`} />
                    <Stat
                      label="Margin"
                      value={`${profitMargin}%`}
                      trend={parseFloat(profitMargin) > 20 ? "up" : "down"}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inventory Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Stock Level
                        </span>
                        <span className="font-medium">
                          {product.stock} units
                        </span>
                      </div>
                      <Progress value={(product.stock / 100) * 100} />
                    </div>
                    <div className="pt-2">
                      <span className="text-sm text-muted-foreground">
                        Category:
                      </span>{" "}
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="pt-4">
            {loading ? (
              <LoadingVariations />
            ) : variations.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {variations.map((variation) => (
                  <VariationCard key={variation.id} variation={variation} />
                ))}
              </div>
            ) : (
              <EmptyVariations />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
