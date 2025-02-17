import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth(); // Obtener el usuario autenticado desde el contexto
  const [userData, setUserData] = useState({
    userName: "",
    Email: "",
    Rol: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/data/listadoUsuarios.json");
        const users = await response.json();

        // Buscar los datos del usuario autenticado
        const foundUser = users.find((u) => u.userName === user?.userName);

        if (foundUser) {
          setUserData({
            userName: foundUser.userName,
            Email: foundUser.Email,
            Rol: foundUser.Rol,
          });
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "350px",backgroundColor: "#FFFF00", padding: "20px", borderRadius: "15px" }}>
        <Card.Body>
          <Card.Title className="text-center fw-bold">Perfil de Usuario</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control 
                type="text" 
                name="userName"
                value={userData.userName} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="Email"
                value={userData.Email} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Control 
                type="text" 
                name="Rol"
                value={userData.Rol} 
                onChange={handleChange} 
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