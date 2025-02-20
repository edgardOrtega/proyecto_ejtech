import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ClientRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  const userRole = Number(user?.rol);
  return userRole === 1 || userRole === 2 ? <Outlet /> : <Navigate to="/" replace />;
};

export default ClientRoute;
