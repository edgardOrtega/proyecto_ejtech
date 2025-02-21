import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = "http://localhost:3000/editarUsuario:"; // URL base de tu API

const EditarUsuario = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 
  const [userData, setUserData] = useState({
    userName: "",
    Email: "",
    Password: "",
    Rol: "",
    Activo: false,
  });

  // Obtener usuario de la API
  useEffect(() => {
    if (!id) return;
  
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setUserData(response.data);
      } catch (error) {
        Swal.fire("Error", "Usuario no encontrado", "error");
        navigate("/ListarUsuarios");
      }
    };
  
    fetchUser();
  }, [id, navigate]);
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Enviar cambios al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${id}`, userData);
      Swal.fire("Guardado", "Los cambios se han guardado correctamente", "success");
      navigate("/listar-usuarios");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", backgroundColor: "#FFFF00", padding: "20px", borderRadius: "15px" }}>
        <Card.Body>
          <Card.Title className="text-center fw-bold">Editar Usuario</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Usuario</Form.Label>
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

            {/* Campo de contraseña con icono de mostrar/ocultar */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  value={userData.Password}
                  onChange={handleChange}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
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

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                name="Activo"
                label="Usuario activo"
                checked={userData.Activo}
                onChange={handleChange} 
              />
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              Guardar Cambios
            </Button>
            <Button variant="secondary" className="w-100 mt-2" onClick={() => navigate("/ListarUsuarios")}>
              Cancelar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditarUsuario;
