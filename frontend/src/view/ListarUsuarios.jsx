import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3000/api/listarUsuarios"; // 🔹 Nueva URL para la API

const ListarUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔹 Enviar token de autenticación
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError("Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (id_usuario) => {
    navigate(`/EditarUsuario/${id_usuario}`);
  };

  const handleDelete = async (id_usuario) => {
    console.log("Intentando eliminar usuario con ID:", id_usuario); // 👀 Verificar el ID en consola
  
    if (!id_usuario) {
      Swal.fire("Error", "ID de usuario no válido", "error");
      return;
    }
  
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:3000/api/listarUsuarios/${id_usuario}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔐 Si usas token
            },
          });
  
          if (response.status === 200) {
            setUsers(users.filter((user) => user.id_usuario !== id_usuario)); // 🟩 Filtrar para actualizar tabla
            Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
          } else {
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
          }
        } catch (err) {
          console.error("Error al eliminar usuario:", err);
          Swal.fire("Error", "No se pudo eliminar el usuario", "error");
        }
      }
    });
  };
  
  
  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <Container className="mt-4">
      <h4 className="text-center fw-bold">LISTADO DE USUARIOS</h4>
      <Table
        striped
        bordered
        hover
        responsive
        className="text-center align-middle mt-3"
      >
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Fecha Creación</th>
            <th>Modificar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.id_rol}</td>
              <td>{user.activo ? "Sí" : "No"}</td>
              <td>{new Date(user.creado_en).toLocaleDateString()}</td>

              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(user.id_usuario)}
                >
                  ✏️ Editar
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user.id_usuario)} // 🔥 Asegúrate de que pase 'id_usuario'
                >
                  🗑️ Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListarUsuarios;
