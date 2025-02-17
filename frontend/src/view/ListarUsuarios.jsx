import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const JSON_FILE = "/data/listadoUsuarios.json"; // Ruta del JSON

const ListarUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(JSON_FILE);
        setUsers(response.data);
      } catch (err) {
        setError("Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    navigate(`/EditarUsuario/${id}`);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((user) => user.id !== id));
        Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
      }
    });
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <Container className="mt-4">
      <h4 className="text-center fw-bold">LISTADO DE USUARIOS</h4>
      <Table striped bordered hover responsive className="text-center align-middle mt-3">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
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
              <td>{user.userName}</td>
              <td>{user.Email}</td>
              <td>{user.Password}</td>
              <td>{user.Rol}</td>
              <td>{user.Activo ? "Sí" : "No"}</td>
              <td>{new Date(user.Fecha_creado).toLocaleDateString()}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(user.id)}>
                  ✏️ Editar
                </Button>
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
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
