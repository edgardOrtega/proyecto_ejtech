import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ClientRoute = () => {
  const { user } = useAuth();

  // Convertir user.rol a número si viene como string
  const userRole = Number(user?.rol);

  if (userRole === 1 || userRole === 2) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default ClientRoute;
