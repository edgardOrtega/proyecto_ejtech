import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";



const EditarUsuario = () => {
  const { id_usuario } = useParams(); // 👈 Obtener el ID desde la URL
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    id_rol: "",
    activo: false,
  });

  const apiUrl = import.meta.env.VITE_API_URL; // Para Vite

  useEffect(() => {
    const fetchUser = async () => {
      console.log(`🔎 URL de la API: ${apiUrl}/${id_usuario}`); // ✅ Verificar en consola
      try {
        const response = await axios.get(`${apiUrl}/EditarUsuario/${id_usuario}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("✅ Datos recibidos:", response.data); // ✅ Verificar los datos recibidos
        setUserData(response.data);
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
  
    // Preparar el payload solo con los campos necesarios
    const payload = {
      username: userData.username,
      email: userData.email,
      id_rol: Number(userData.id_rol),
      activo: userData.activo,
    };
  
    // Si la contraseña no está vacía, incluirla
    if (userData.password.trim() !== "") {
      payload.password = userData.password;
    }
  
    //console.log("✍ Enviando datos:", payload);
  
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
