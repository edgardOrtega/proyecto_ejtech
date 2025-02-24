import { useEffect } from "react";
import "./App.css";
import Navegation from "./components/Navegation";
import Home from "./view/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./view/Login";
import Register from "./view/Register";
import Profile from "./view/Profile";
import ListarUsuarios from "./view/ListarUsuarios";
import ListarProductos from "./view/ListarProductos";
import CrearProducto from "./view/CrearProducto";
import Galeria from "./view/Galeria";
import Carrito from "./view/Carrito";
import Historial from "./view/Historial"; 
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";
import EditarUsuario from "./view/EditarUsuario";
import EditarProducto from "./view/EditarProducto";
import Error404 from "./view/Error404";
import GuestRoute from "./components/GuestRoute";
import DetalleProducto from "./view/DetalleProducto";
import Ejtech from "./view/Ejtech";

function App() {
  useEffect(() => {
    console.log("✅ Aplicación cargada correctamente");
  }, []);

  return (
    <AuthProvider>
      <Navegation />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/Ejtech" element={<Ejtech />} />
        {/* 🔹 Solo accesibles para usuarios NO logueados */}
        <Route element={<GuestRoute />}>
          <Route path="/Login" element={<Login />} />

          <Route path="/Register" element={<Register />} />
        </Route>

        {/* 🔹 Rutas accesibles para clientes y administradores */}
        <Route element={<ClientRoute />}>
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Galeria" element={<Galeria />} />
          <Route path="/Carrito" element={<Carrito />} />
          <Route path="/Historial" element={<Historial />} />
          <Route path="/Producto/:id" element={<DetalleProducto />} />
        </Route>

        {/* 🔹 Rutas exclusivas para administradores */}
        <Route element={<AdminRoute />}>
          <Route path="/ListarUsuarios" element={<ListarUsuarios />} />
          <Route path="/ListarProductos" element={<ListarProductos />} />
          <Route path="/CrearProducto" element={<CrearProducto />} />
          <Route path="/EditarProducto/:id" element={<EditarProducto />} />
          <Route path="/EditarUsuario/:id_usuario" element={<EditarUsuario />} />
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
