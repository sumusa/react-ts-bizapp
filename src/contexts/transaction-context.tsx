/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
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

interface TransactionContextType {
  transactions: Transaction[];
  calculateProfit: () => {
    revenue: number;
    expenses: number;
    profit: number;
  };
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  const calculateProfit = () => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.revenue += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        acc.profit = acc.revenue - acc.expenses;
        return acc;
      },
      { revenue: 0, expenses: 0, profit: 0 }
    );
  };

  return (
    <TransactionContext.Provider value={{ transactions, calculateProfit }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
}
