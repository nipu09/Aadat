import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Loading = () => <p className="p-8">Loading…</p>;

// Pages only for logged-in users
export function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Pages only for logged-out users (login, verify email)
export function GuestOnly() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
