import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";

const EditarUsuario = () => {
  const { id_usuario } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    id_rol: "",
    activo: false,
  });

  const [initialUserData, setInitialUserData] = useState(null); // Guardar datos originales

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/editarUsuario/${id_usuario}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        console.log("✅ Datos recibidos:", response.data);
        setUserData(response.data);
        setInitialUserData(response.data); // Guardamos los valores iniciales
      } catch (error) {
        console.error("❌ Error al obtener usuario:", error.response || error);
        Swal.fire("Error", "Usuario no encontrado", "error");
        navigate("/ListarUsuarios");
      }
    };
  
    fetchUser();
  }, [id_usuario, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initialUserData) return;

    // Verificar si el email o la contraseña han cambiado
    const emailChanged = userData.email !== initialUserData.email;
    const passwordChanged = userData.password.trim() !== "";

    if ((emailChanged && !passwordChanged) || (!emailChanged && passwordChanged)) {
      Swal.fire("Error", "Si cambias el email, también debes cambiar la contraseña (y viceversa)", "warning");
      return;
    }

    // Crear el payload con los datos a actualizar
    const payload = {
      username: userData.username,
      email: userData.email,
      id_rol: Number(userData.id_rol),
      activo: userData.activo,
    };

    if (passwordChanged) {
      payload.password = userData.password;
    }

    try {
      const response = await axios.put(`${apiUrl}/api/editarUsuario/${id_usuario}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("✅ Usuario actualizado:", response.data);
      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      navigate("/ListarUsuarios");
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error.response || error);
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  return (
    <Container className="mt-4">
      <h4 className="text-center">Editar Usuario</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" value={userData.username} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={userData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" value={userData.password} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <Form.Select name="id_rol" value={userData.id_rol} onChange={handleChange} required>
            <option value="">Selecciona un rol</option>
            <option value="1">Administrador</option>
            <option value="2">Cliente</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Activo" name="activo" checked={userData.activo} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Guardar cambios
        </Button>
      </Form>
    </Container>
  );
};

export default EditarUsuario;
