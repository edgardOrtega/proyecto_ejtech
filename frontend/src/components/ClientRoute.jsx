import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ClientRoute = () => {
  const { user } = useAuth();

  // Si el usuario es cliente o administrador, puede acceder a las rutas de cliente
  if (user?.rol === "cliente" || user?.rol === "administrador") {
    return <Outlet />;
  }

  // Si no está autenticado, lo redirigimos a Home
  return <Navigate to="/" replace />;
};

export default ClientRoute;
