import { PageTemplate } from "@/components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  TrendingUp,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  notes?: string;
  orderId?: string;
}

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      return;
    }

    setTransactions(data || []);
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || transaction.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const calculateTotals = () => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        acc.profit = acc.income - acc.expenses;
        return acc;
      },
      { income: 0, expenses: 0, profit: 0 }
    );
  };

  const { income, expenses, profit } = calculateTotals();

  return (
    <PageTemplate mainSection="Finances" subSection="Overview">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="rounded-full bg-green-500/10 p-2">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Income
                </p>
                <h3 className="text-2xl font-bold">${income.toFixed(2)}</h3>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  8.2%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="rounded-full bg-red-500/10 p-2">
                <CreditCard className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </p>
                <h3 className="text-2xl font-bold">${expenses.toFixed(2)}</h3>
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-4 w-4" />
                  3.1%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="rounded-full bg-blue-500/10 p-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
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

        {/* Transactions Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transactions</CardTitle>
              <AddTransactionDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </AddTransactionDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedCategory || "All Categories"}
                </Button>
              </div>

              {/* Transactions Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() =>
                            setSelectedCategory(transaction.category)
                          }
                        >
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}
