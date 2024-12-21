import { PageTemplate } from "@/components/page-template";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Filter, ArrowUpDown } from "lucide-react";
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
import { useState } from "react";
import { AddCustomerDialog } from "@/components/add-customer-dialog";
import { CustomerDetailsDialog } from "@/components/customer-details-dialog";

const sampleCustomers = [
  {
    id: "CUS001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234-567-8900",
    totalOrders: 15,
    totalSpent: 1250.5,
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: "CUS002",
    name: "Sarah Smith",
    email: "sarah@example.com",
    phone: "+1 234-567-8901",
    totalOrders: 8,
    totalSpent: 750.25,
    status: "Active",
    joinDate: "2024-02-01",
  },
  {
    id: "CUS003",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 234-567-8902",
    totalOrders: 3,
    totalSpent: 250.75,
    status: "Inactive",
    joinDate: "2024-02-15",
  },
];

export default function CustomersPage() {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof sampleCustomers)[0];
    direction: "asc" | "desc";
  } | null>(null);

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

  const sortedCustomers = [...sampleCustomers].sort((a, b) => {
    if (!sortConfig) return 0;

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof (typeof sampleCustomers)[0]) => {
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
    <PageTemplate mainSection="Customers" subSection="List">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customers</h1>
          <AddCustomerDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </AddCustomerDialog>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-9" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Customers Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  onClick={() => requestSort("id")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Customer ID <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("name")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("email")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Email <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("phone")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Phone <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("totalOrders")}
                  className="cursor-pointer hover:text-foreground text-center"
                >
                  Orders <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("totalSpent")}
                  className="cursor-pointer hover:text-foreground text-right"
                >
                  Total Spent <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("status")}
                  className="cursor-pointer hover:text-foreground text-center"
                >
                  Status <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => requestSort("joinDate")}
                  className="cursor-pointer hover:text-foreground"
                >
                  Join Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50">
                  <CustomerDetailsDialog customer={customer}>
                    <TableCell className="font-medium cursor-pointer">
                      {customer.id}
                    </TableCell>
                  </CustomerDetailsDialog>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="text-center">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="text-right">
                    ${customer.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.joinDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageTemplate>
  );
}
