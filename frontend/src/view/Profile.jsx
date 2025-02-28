import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth(); 

  const [userData, setUserData] = useState({
      username: user?.username || "",
      email: user?.email || "",
      rol: user?.rol === 1 ? "Administrador" : "Cliente",
  });

  // Cuando `user` cambie, actualizar `userData`
  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username || "Usuario",
        email: user.email || "Sin email",
        rol: user.rol === 1 ? "Administrador" : "Cliente",
      });
    }
  }, [user]); // 👈 Se ejecuta cada vez que `user` cambia

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "350px", backgroundColor: "#FFFF00", padding: "20px", borderRadius: "15px" }}>
        <Card.Body>
          <Card.Title className="text-center fw-bold">Perfil de Usuario</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control type="text" value={userData.username} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={userData.email} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Control type="text" value={userData.rol} disabled />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;