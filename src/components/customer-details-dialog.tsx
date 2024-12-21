import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  CreditCard,
  ClipboardList,
} from "lucide-react";

interface CustomerDetailsProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    status: string;
    joinDate: string;
  };
  children: React.ReactNode;
}

// Sample data - in a real app, this would come from your database
const sampleCustomerDetails = {
  address: "123 Main St",
  city: "New York",
  country: "United States",
  postalCode: "10001",
  notes: "Preferred shipping method: Express",
  recentOrders: [
    {
      id: "ORD001",
      date: "2024-03-15",
      total: 159.99,
      status: "Delivered",
    },
    {
      id: "ORD002",
      date: "2024-02-28",
      total: 89.99,
      status: "Processing",
    },
    {
      id: "ORD003",
      date: "2024-02-14",
      total: 249.99,
      status: "Delivered",
    },
  ],
};

export function CustomerDetailsDialog({
  customer,
  children,
}: CustomerDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "destructive";
      default:
        return "default";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "warning";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex-row items-center justify-between space-y-4 space-x-4">
          <DialogTitle className="flex-1">Customer Details</DialogTitle>
          <Badge variant={getStatusColor(customer.status)}>
            {customer.status}
          </Badge>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                Customer ID
              </div>
              <p className="font-medium">{customer.id}</p>
              <p className="text-sm text-muted-foreground">
                Joined {customer.joinDate}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Account Status
              </div>
              <p className="font-medium">{customer.name}</p>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                Email Address
              </div>
              <p className="font-medium">{customer.email}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                Phone Number
              </div>
              <p className="font-medium">{customer.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              Shipping Address
            </div>
            <p className="font-medium">{sampleCustomerDetails.address}</p>
            <p className="text-sm text-muted-foreground">
              {sampleCustomerDetails.city}, {sampleCustomerDetails.country}{" "}
              {sampleCustomerDetails.postalCode}
            </p>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Total Orders
              </div>
              <p className="text-2xl font-bold">{customer.totalOrders}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <CreditCard className="mr-2 h-4 w-4" />
                Total Spent
              </div>
              <p className="text-2xl font-bold">
                ${customer.totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <ClipboardList className="mr-2 h-4 w-4" />
                Notes
              </div>
              <p className="text-sm">{sampleCustomerDetails.notes}</p>
            </div>
          </div>

          <Separator />

          {/* Recent Orders */}
          <div className="space-y-4">
            <h4 className="font-medium">Recent Orders</h4>
            <div className="space-y-4">
              {sampleCustomerDetails.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">${order.total}</p>
                    <Badge variant={getOrderStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
