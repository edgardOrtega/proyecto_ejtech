import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth(); // Obtener usuario desde el contexto

  // Inicializar los valores del formulario con los datos del contexto
  const [userData, setUserData] = useState({
    userName: user?.username || "", // Asegurar que `user.username` esté disponible
    email: user?.email || "",
    rol: user?.rol === 1 ? "Administrador" : "Cliente", // Convertir el rol en texto
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "350px", backgroundColor: "#FFFF00", padding: "20px", borderRadius: "15px" }}>
        <Card.Body>
          <Card.Title className="text-center fw-bold">Perfil de Usuario</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control 
                type="text" 
                name="userName"
                value={userData.username} 
                onChange={handleChange} 
                disabled // Deshabilitado si no se quiere editar
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={userData.email} 
                onChange={handleChange} 
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Control 
                type="text" 
                name="rol"
                value={userData.rol} 
                onChange={handleChange} 
                disabled
              />
            </Form.Group>

            <Button variant="dark" className="w-100">
              Guardar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;