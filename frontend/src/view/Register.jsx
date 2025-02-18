import React, { useState } from "react";
import { Form, Button, InputGroup, Card } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fecha_nacimiento: "",
    id_rol: 2, // Por defecto, cliente
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    
    try {
      const response = await fetch("http://localhost:3000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fecha_nacimiento: formData.fecha_nacimiento,
          id_rol: formData.id_rol,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Error al registrar usuario");
      }

      const data = await response.json();
      Swal.fire({ title: "Registro exitoso", text: "Usuario creado correctamente", icon: "success" })
        .then(() => navigate("/login"));
    } catch (error) {
      setError("Hubo un error en el registro");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "22rem", backgroundColor: "#fefe00", padding: "20px", borderRadius: "15px" }}>
        <Card.Body>
          <Card.Title className="text-center fw-bold fs-4">Formulario de Registro</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre usuario</Form.Label>
              <Form.Control type="text" name="username" placeholder="Ingrese su nombre" required onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control type="date" name="fecha_nacimiento" required onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" placeholder="Ingrese su email" required onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control type={showPassword ? "text" : "password"} name="password" placeholder="Ingrese su contraseña" required onChange={handleChange} />
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  <FaEye />
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <InputGroup>
                <Form.Control type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirme su contraseña" required onChange={handleChange} />
                <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <FaEye />
                </Button>
              </InputGroup>
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <div className="d-grid">
              <Button variant="dark" type="submit">Registrar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
