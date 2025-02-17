import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/edpak.png";
import Logout from "../view/Logout";
import { useAuth } from "../context/AuthContext"; // Importa el contexto de autenticación

const Navegation = () => {
  const { user } = useAuth(); // Obtenemos el usuario autenticado

  return (
    <Navbar bg="light" expand="lg">
      <Container className="contenedor">
        <Navbar.Brand as={NavLink} to="/">
          <img className="logo img-fluid rounded" src={logo} alt="Proyecto Tecnológico" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Enlaces públicos (para todos) */}
            <Nav.Link as={NavLink} to="/" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</Nav.Link>
            {!user && <Nav.Link as={NavLink} to="/Register" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Registro</Nav.Link>}
            {!user && <Nav.Link as={NavLink} to="/Login" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Inicio sesión</Nav.Link>}

            {/* Enlaces para usuario autenticado */}
            {user && (
              <>
                <Nav.Link as={NavLink} to="/Profile" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Mi perfil</Nav.Link>
                <Nav.Link as={NavLink} to="/Galeria" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Galería</Nav.Link>

                {/* Enlaces solo para ADMINISTRADOR */}
                {user.rol === "administrador" && (
                  <>
                    <Nav.Link as={NavLink} to="/ListarUsuarios" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Listar Usuarios</Nav.Link>
                    <Nav.Link as={NavLink} to="/ListarProductos" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Listar Producto</Nav.Link>
                    <Nav.Link as={NavLink} to="/CrearProducto" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Crear Producto</Nav.Link>
                    <Nav.Link as={NavLink} to="/Carrito" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Carrito</Nav.Link>
                    <Nav.Link as={NavLink} to="/Historial" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Historial</Nav.Link>
                  </>
                )}

                {/* Enlaces solo para CLIENTE */}
                {user.rol === "cliente" && (
                  <>
                    <Nav.Link as={NavLink} to="/Carrito" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Carrito</Nav.Link>
                    <Nav.Link as={NavLink} to="/Historial" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Historial</Nav.Link>
                  </>
                )}

                {/* Botón de Cerrar Sesión */}
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