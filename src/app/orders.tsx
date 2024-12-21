import { PageTemplate } from "@/components/page-template";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, PlusCircle } from "lucide-react";
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
import { AddOrderDialog } from "@/components/add-order-dialog";

interface Order {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  created_at: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

interface OrderItemResponse {
  id: number;
  price: number;
  quantity: number;
  product: {
    id: number;
    name: string;
  }[];
  variation: {
    color: string;
    size: string;
  }[];
}

function getStatusColor(
  status: string
): "default" | "warning" | "success" | "destructive" {
  switch (status) {
    case "Processing":
      return "warning";
    case "Shipped":
      return "default";
    case "Delivered":
      return "success";
    case "Cancelled":
      return "destructive";
    default:
      return "default";
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data: ordersData, error: ordersError } = await supabase.from(
        "orders"
      ).select(`
          *,
          items:order_items (
            id,
            quantity,
            price,
            product:products (
              id,
              name,
              product_variations (
                color,
                size
              )
            )
          )
        `);

      if (ordersError) throw ordersError;

      console.log("Raw orders data:", ordersData);

      const orders = ordersData.map((order) => ({
        ...order,
        items: order.items.map((item: OrderItemResponse) => ({
          id: Number(item.id),
          product_id: item.product[0]?.id || 0,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
      }));

      console.log("Processed orders:", orders);
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Order) => {
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

  return (
    <PageTemplate mainSection="Orders" subSection="List">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Orders</h1>
          <AddOrderDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Order
            </Button>
          </AddOrderDialog>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-9" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  onClick={() => requestSort("id")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Order ID <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("customer_name")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Customer <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("created_at")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("total")}
                  className="cursor-pointer hover:text-foreground text-right"
                >
                  Total <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("items")}
                  className="cursor-pointer hover:text-foreground text-center"
                >
                  Items <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("status")}
                  className="cursor-pointer hover:text-foreground text-center"
                >
                  Status <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("payment_method")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Payment <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/50 cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      #{order.id.toString().padStart(6, "0")}
                    </TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {order.items.length}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.payment_method}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageTemplate>
  );
}
