import { Navigate, Outlet } from "react-router-dom";

export default function SuperAdminProtectedRoute() {
  const hasAdminSession =
    localStorage.getItem("superadmin_logged_in") === "true" ||
    !!localStorage.getItem("superadmin_admin") ||
    !!localStorage.getItem("superadmin_token");

  if (!hasAdminSession) {
    return <Navigate to="/super-admin" replace />;
  }

  return <Outlet />;
}