import { useState, useEffect } from "react";
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

function App() {
  const [productos, setProductos] = useState([]);
  const [stockDisponible, setStockDisponible] = useState(() => {
    const savedStock = localStorage.getItem("stockDisponible");
    return savedStock ? JSON.parse(savedStock) : {};
  });

  useEffect(() => {
    fetch("/data/tecnologia.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
          setStockDisponible((prev) => {
            const newStock = { ...prev };
            data.forEach((producto, index) => {
              const id = index + 1;
              if (newStock[id] === undefined) newStock[id] = producto.stock;
            });
            localStorage.setItem("stockDisponible", JSON.stringify(newStock));
            return newStock;
          });
        }
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("stockDisponible", JSON.stringify(stockDisponible));
  }, [stockDisponible]);

  const actualizarStock = (id, cantidad) => {
    setStockDisponible((prev) => {
      const stockActual = prev[id] !== undefined ? prev[id] : productos.find(p => p.id === id)?.stock ?? 0;
      const nuevoStock = Math.max(0, stockActual + cantidad);

      console.log(`🔄 Actualizando stock: ID ${id} - Cambio: ${cantidad} - Nuevo Stock: ${nuevoStock}`);

      const updatedStock = { ...prev, [id]: nuevoStock };
      localStorage.setItem("stockDisponible", JSON.stringify(updatedStock));
      return updatedStock;
    });
  };

  return (
    <AuthProvider>
      <Navegation />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />

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
        </Route>

        {/* 🔹 Rutas exclusivas para administradores */}
        <Route element={<AdminRoute />}>
          <Route path="/ListarUsuarios" element={<ListarUsuarios />} />
          <Route path="/ListarProductos" element={<ListarProductos />} />
          <Route path="/CrearProducto" element={<CrearProducto />} />
          <Route path="/EditarProducto/:id" element={<EditarProducto />} />
          <Route path="/EditarUsuario/:id" element={<EditarUsuario />} />
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
