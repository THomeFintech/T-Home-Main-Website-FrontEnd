import { Navigate, Outlet } from "react-router-dom";

export default function SuperAdminProtectedRoute() {
  const token = localStorage.getItem("superadmin_token");

  if (!token) {
    return <Navigate to="/super-admin" replace />;
  }

  return <Outlet />;
}