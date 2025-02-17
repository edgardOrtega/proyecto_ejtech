import React, { useState } from "react";
import { Form, Button, InputGroup, Card } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      Swal.fire({
        title: `¡Bienvenido!`,
        text: `Tu rol es: ${result.rol}`,
        icon: "success",
        confirmButtonText: "Continuar",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/Galeria");
      });
    } else {
      Swal.fire({
        title: "Error",
        text: result.message,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 text-center login-card">
        <h2 className="fw-bold">Inicio de Sesión</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FaEye />
              </Button>
            </InputGroup>
          </Form.Group>

          <Button className="w-100 login-btn mb-2 boton-login" type="submit">
            Entrar
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;