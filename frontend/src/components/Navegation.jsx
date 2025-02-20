import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/edpak.png";
import Logout from "../view/Logout";
import { useAuth } from "../context/AuthContext";

const Navegation = () => {
  const { user } = useAuth();
  const userRole = Number(user?.rol); // 🔹 Convertir rol a número si es string
  const userRoleName = user?.nombre_rol?.trim() || ""; // 🔹 Obtener el nombre del rol y evitar valores nulos

  return (
    <Navbar bg="light" expand="lg">
      <Container className="contenedor">
        <Navbar.Brand as={NavLink} to="/">
          <img className="logo img-fluid rounded" src={logo} alt="Proyecto Tecnológico" />
          
          {/* 🔹 Mostrar el rol solo si el usuario NO es cliente y el nombre del rol existe */}
          {user && userRole !== 2 && userRoleName && (
            <span className="text-secondary rol-navbar">{userRoleName}</span>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={NavLink} 
              to="/" 
              className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
            >
              Home
            </Nav.Link>

            {!user ? (
              <>
                <Nav.Link 
                  as={NavLink} 
                  to="/Login" 
                  className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                >
                  Inicio sesión
                </Nav.Link>

                <Nav.Link 
                  as={NavLink} 
                  to="/Register" 
                  className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                >
                  Registro
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={NavLink} 
                  to="/Profile" 
                  className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                >
                  Perfil
                </Nav.Link>

                <Nav.Link 
                  as={NavLink} 
                  to="/Galeria" 
                  className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                >
                  Galería
                </Nav.Link>

                {/* 🔹 Accesible para clientes y administradores */}
                {(userRole === 1 || userRole === 2) && (
                  <>
                    <Nav.Link 
                      as={NavLink} 
                      to="/Carrito" 
                      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                    >
                      Carrito
                    </Nav.Link>

                    <Nav.Link 
                      as={NavLink} 
                      to="/Historial" 
                      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                    >
                      Historial
                    </Nav.Link>
                  </>
                )}

                {/* 🔹 Opciones exclusivas para ADMINISTRADOR (id_rol === 1) */}
                {userRole === 1 && (
                  <>
                    <Nav.Link 
                      as={NavLink} 
                      to="/ListarUsuarios" 
                      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                    >
                      Listar Usuarios
                    </Nav.Link>

                    <Nav.Link 
                      as={NavLink} 
                      to="/ListarProductos" 
                      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                    >
                      Listar Productos
                    </Nav.Link>

                    <Nav.Link 
                      as={NavLink} 
                      to="/CrearProducto" 
                      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                    >
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
