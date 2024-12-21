import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useLocation } from "react-router-dom";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Public routes that don't require authentication
  const publicRoutes = ["/signup", "/login"];

  // Wait for auth state to be determined
  if (isLoading) {
    return null;
  }

  if (publicRoutes.includes(location.pathname)) {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  }

  // Protected routes require authentication
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
