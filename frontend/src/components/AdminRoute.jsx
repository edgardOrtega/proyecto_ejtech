import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();

  // Convertir user.rol a número si viene como string
  const userRole = Number(user?.rol);

  if (userRole === 1) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
