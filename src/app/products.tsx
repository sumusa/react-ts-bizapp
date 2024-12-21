import { PageTemplate } from "@/components/page-template";
import { Button } from "@/components/ui/button";
import { AddProductDialog } from "@/components/add-product-dialog";
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Pencil,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { EditProductDialog } from "@/components/edit-product-dialog";
import { ProductDetailsDialog } from "@/components/product-details-dialog";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase.from("products").select(`
          *,
          product_variations (*)
        `);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Product) => {
    setSortConfig((currentSort) => ({
      key,
      direction:
        !currentSort ||
        currentSort.key !== key ||
        currentSort.direction === "desc"
          ? "asc"
          : "desc",
    }));
  };

  async function deleteProduct(id: number) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      fetchProducts(); // Refresh the list
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product. Please try again.");
    }
  }

  return (
    <PageTemplate mainSection="Products" subSection="Inventory">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Products</h1>
          <AddProductDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </AddProductDialog>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Updated Products Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  onClick={() => requestSort("name")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Product <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("sku")}
                  className="cursor-pointer hover:text-foreground"
                >
                  SKU <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("category")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Category <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("price")}
                  className="cursor-pointer hover:text-foreground text-right"
                >
                  Price <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("stock")}
                  className="cursor-pointer hover:text-foreground text-right"
                >
                  Stock <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("status")}
                  className="cursor-pointer hover:text-foreground text-center"
                >
                  Status <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <ProductDetailsDialog product={product}>
                      <Button variant="link" className="p-0 h-auto font-normal">
                        {product.name}
                      </Button>
                    </ProductDetailsDialog>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${product.price}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.stock <= 5 ? "destructive" : "success"}
                    >
                      {product.stock <= 5 ? "Low Stock" : "In Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditProductDialog
                        product={product}
                        onProductUpdated={fetchProducts}
                      >
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </EditProductDialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this product?"
                            )
                          ) {
                            deleteProduct(product.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageTemplate>
  );
}
