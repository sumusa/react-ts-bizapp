import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogFooter } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";

interface OrderDetailsProps {
  order: {
    id: string;
    customer: string;
    customerName: string;
    email: string;
    phone: string;
    shippingAddress: string;
    paymentMethod: string;
    created_at?: string;
    date: string;
    total: number;
    status: string;
    items: Array<{
      id: string;
      price: number;
      quantity: number;
      product: {
        name: string;
      };
      variation?: {
        color: string;
        size: string;
      };
    }>;
    payment: string;
  };
  children: React.ReactNode;
}

export function OrderDetailsDialog({ order, children }: OrderDetailsProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "warning";
      case "Shipped":
        return "primary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const subtotal = Array.isArray(order.items)
    ? order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;
  const shipping = 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Order #{order.id}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(order.created_at || order.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
            <Badge variant={getStatusColor(order.status)} className="ml-2">
              {order.status}
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
            variant={activeTab === "items" ? "default" : "ghost"}
            className="relative px-4"
            onClick={() => setActiveTab("items")}
          >
            Items ({order.items.length})
            {activeTab === "items" && (
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
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      Contact Details
                    </div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.phone}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      Shipping Address
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {order.shippingAddress}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Method
                    </div>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Variation</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product.name}
                      </TableCell>
                      <TableCell>
                        {item.variation
                          ? `${item.variation.color} - ${item.variation.size}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${subtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          {order.status === "Processing" && (
            <Button
              onClick={() => {
                /* Handle shipping status update */
              }}
            >
              Mark as Shipped
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
