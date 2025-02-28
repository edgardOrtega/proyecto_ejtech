import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/edpak.png";
import Logout from "../view/Logout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

const Navegation = () => {
  const { user, authTrigger } = useAuth(); // Escuchar cambios en authTrigger (globo carrito)
  const { cart, fetchCart } = useCart();
  const userRole = Number(user?.rol);
  const userRoleName = user?.nombre_rol?.trim() || "";
  const [cartUpdated, setCartUpdated] = useState(false);

  const productTypes = Object.keys(cart || {}).length;

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cartUpdated) {
      fetchCart();
      setCartUpdated(false);
    }
  }, [cartUpdated]);

  // 🔥 Se ejecuta cada vez que cambia authTrigger (login/logout)
  useEffect(() => {
    console.log("🔄 Navbar actualizado por authTrigger:", authTrigger);
  }, [authTrigger]);

  return (
    <Navbar bg="light" expand="lg" className="fixed-top shadow">
      <Container className="contenedor">
        <Navbar.Brand as={NavLink} to="/">
          <img className="logo img-fluid rounded" src={logo} alt="Proyecto Tecnológico" />
          {user && userRole !== 2 && userRoleName && (
            <span className="text-secondary rol-navbar">{userRoleName}</span>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
              Home
            </Nav.Link>

            {!user ? (
              <>
                <Nav.Link as={NavLink} to="/Register" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                  Registro
                </Nav.Link>
                <Nav.Link as={NavLink} to="/Login" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                  Inicio sesión
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/Profile" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                  Perfil
                </Nav.Link>

                <Nav.Link as={NavLink} to="/Galeria" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                  Galería
                </Nav.Link>

                <Nav.Link 
                  as={NavLink} 
                  to="/Carrito" 
                  className={({ isActive }) => (isActive ? "nav-link active-link position-relative cart-button" : "nav-link position-relative cart-button")}
                  onClick={() => setCartUpdated(true)}
                >
                  Carrito
                  {productTypes > 0 && <span className="cart-badge">{productTypes}</span>}
                </Nav.Link>

                {(userRole === 1 || userRole === 2) && (
                  <Nav.Link as={NavLink} to="/Historial" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                    Historial
                  </Nav.Link>
                )}

                {userRole === 1 && (
                  <>
                    <Nav.Link as={NavLink} to="/ListarUsuarios" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                      Listar Usuarios
                    </Nav.Link>

                    <Nav.Link as={NavLink} to="/ListarProductos" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                      Listar Productos
                    </Nav.Link>

                    <Nav.Link as={NavLink} to="/CrearProducto" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                      Crear Producto
                    </Nav.Link>
                  </>
                )}

                <Logout />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navegation;
