import { PageTemplate } from "@/components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleUser,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";
import { useTransactions } from "@/contexts/transaction-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  recentOrders: {
    id: string;
    status: string;
    created_at: string;
  }[];
  recentCustomers: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const { transactions, calculateProfit } = useTransactions();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
    recentCustomers: [],
  });
  const [timeframe, setTimeframe] = useState("week"); // week, month, year

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      const [customersData, ordersData, productsData] = await Promise.all([
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("products").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalCustomers: customersData.count ?? 0,
        totalOrders: ordersData.data?.length || 0,
        totalProducts: productsData.count ?? 0,
        recentOrders: ordersData.data || [],
        recentCustomers: [],
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }

  const { revenue, expenses, profit } = calculateProfit();

  // Sample data for charts
  const revenueData = [
    { name: "Mon", value: 1500 },
    { name: "Tue", value: 1800 },
    { name: "Wed", value: 1400 },
    { name: "Thu", value: 2200 },
    { name: "Fri", value: 1900 },
    { name: "Sat", value: 2400 },
    { name: "Sun", value: 2100 },
  ];

  const expensesByCategory = [
    { name: "Inventory", value: expenses * 0.35 },
    { name: "Marketing", value: expenses * 0.25 },
    { name: "Operations", value: expenses * 0.2 },
    { name: "Other", value: expenses * 0.2 },
  ];

  return (
    <PageTemplate mainSection="Dashboard" subSection="Overview">
      {/* Existing Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="flex flex-row items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-2">
              <CircleUser className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Customers
              </p>
              <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4" />
                12.5%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center gap-4 p-6">
            <div className="rounded-full bg-orange-500/10 p-2">
              <ShoppingCart className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4" />
                8.2%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center gap-4 p-6">
            <div className="rounded-full bg-green-500/10 p-2">
              <CreditCard className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <h3 className="text-2xl font-bold">${revenue.toFixed(2)}</h3>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4" />
                15.3%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center gap-4 p-6">
            <div className="rounded-full bg-purple-500/10 p-2">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Net Profit
              </p>
              <h3 className="text-2xl font-bold">${profit.toFixed(2)}</h3>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4" />
                5.1%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Section */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Overview</CardTitle>
              <div className="space-x-2">
                <Button
                  variant={timeframe === "week" ? "default" : "outline"}
                  onClick={() => setTimeframe("week")}
                >
                  Week
                </Button>
                <Button
                  variant={timeframe === "month" ? "default" : "outline"}
                  onClick={() => setTimeframe("month")}
                >
                  Month
                </Button>
                <Button
                  variant={timeframe === "year" ? "default" : "outline"}
                  onClick={() => setTimeframe("year")}
                >
                  Year
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0088FE" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Analytics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{order.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {expensesByCategory.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div
                    className={`rounded-full p-2 ${
                      transaction.type === "income"
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    <DollarSign
                      className={`h-4 w-4 ${
                        transaction.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category}
                    </p>
                  </div>
                  <p
                    className={`font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}
