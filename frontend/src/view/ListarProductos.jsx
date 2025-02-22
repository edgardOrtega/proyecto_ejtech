import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3000/api/listarProductos"; // ✅ URL de la API real

const ListarProductos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL); // ✅ Cambiamos la URL a la API real
        setProducts(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/EditarProducto/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ✅ Enviar solicitud DELETE al backend
          const response = await axios.delete(`http://localhost:3000/api/eliminarProducto/${id}`);
  
          if (response.status === 200) {
            // 🔥 Eliminar del estado después de confirmación del backend
            setProducts((prevProducts) => prevProducts.filter(product => product.id_producto !== id));
  
            Swal.fire("Eliminado!", "El producto ha sido eliminado.", "success");
          }
        } catch (error) {
          console.error("Error al eliminar:", error);
          Swal.fire("Error!", "No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="container mt-4">
      <h4 className="text-center fw-bold">LISTADO DE PRODUCTOS</h4>
      <Table striped bordered hover className="text-center align-middle mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Modificar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
        {products.map((product) => (
    <tr key={product.id_producto}> 
      <td>{product.nombre}</td>
      <td>{product.descripcion}</td>
      <td>{product.precio}</td>
      <td>{product.stock}</td>
      <td>{product.categoria}</td>  
      <td>
        <Button variant="warning" size="sm" onClick={() => handleEdit(product.id_producto)}>✏️ Editar</Button>
      </td>
      <td>
        <Button variant="danger" size="sm" onClick={() => handleDelete(product.id_producto)}>🗑️ Eliminar</Button>
      </td>
    </tr>
  ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListarProductos;
