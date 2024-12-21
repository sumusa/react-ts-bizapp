import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./app/dashboard";
import ProductsPage from "./app/products";
import OrdersPage from "./app/orders";
import CustomersPage from "./app/customers";
import FinancesPage from "./app/finances";
import NotesPage from "./app/notes";
import LoginPage from "./app/login";
import SignupPage from "./app/signup";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth";
import { TransactionProvider } from "@/contexts/transaction-context";
import { ProtectedRoute } from "@/components/protected-route";
import SettingsPage from "./app/settings";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <AuthProvider>
          <TransactionProvider>
            <Routes>
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/finances" element={<FinancesPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/signup" replace />} />
            </Routes>
          </TransactionProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
