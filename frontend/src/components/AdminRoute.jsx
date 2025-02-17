import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();

  // Si el usuario es administrador, puede acceder a cualquier ruta
  if (user?.rol === "administrador") {
    return <Outlet />;
  }

  // Si el usuario es cliente, lo redirigimos sin desloguearlo
  return <Navigate to="/" replace />;
};

export default AdminRoute;
