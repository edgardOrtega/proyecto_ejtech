import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  console.log("GuestRoute - isAuthenticated:", isAuthenticated);
  console.log("GuestRoute - loading:", loading);
  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? <Navigate to="/Profile" replace /> : <Outlet />;
};

export default GuestRoute;
