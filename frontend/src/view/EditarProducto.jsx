import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, Button, Form, Spinner, Row, Col } from "react-bootstrap";

const apiUrl = import.meta.env.VITE_API_URL; // Para Vite
const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productoOriginal, setProductoOriginal] = useState(null);
  const [productoEditado, setProductoEditado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        console.log("ID recibido:", id);
        const response = await axios.get(`${apiUrl}/${id}`);
        console.log("Respuesta de la API:", response.data);

        if (!response.data) {
          throw new Error("Producto no encontrado");
        }

        setProductoOriginal(response.data);
        setProductoEditado({ ...response.data }); // Clonamos el producto para edición
      } catch (err) {
        console.error("🚨 Error al obtener el producto:", err);
        setError("Producto no encontrado");
        Swal.fire("Error", "Producto no encontrado", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault(); // Evita recargar la página

    const { nombre, descripcion, precio, stock } = productoEditado;

    // Validar que los campos requeridos no estén vacíos
    if (!nombre || !descripcion || !precio || !stock) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      const response = await axios.put(`${apiUrl}/${id}`, {
        nombre,
        descripcion,
        precio: Number(precio),
        stock: Number(stock),
      });

      if (response.status === 200) {
        Swal.fire("Guardado!", "Los cambios han sido guardados.", "success");
        navigate("/ListarProductos"); // Redirigir a la lista de productos
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire("Error", "No se pudo actualizar el producto.", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prevState) => {
      console.log("Cambiando:", name, value);
      return { ...prevState, [name]: value };
    });
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="container mt-4 editarproducto">
      <h2 className="text-center">Editar Producto</h2>
      <Row className="mt-4">
        {/* 🔹 Columna izquierda: Producto reflejado */}
        <Col md={6}>
          <Card className="shadow">
            <Card.Img
              variant="top"
              src={productoOriginal.imagen}
              style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
            />
            <Card.Body>
              <Card.Title>{productoOriginal.nombre}</Card.Title>

              {/* 🔹 Descripción con barra de desplazamiento */}
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <strong>Descripción:</strong> {productoOriginal.descripcion}
              </div>

              <br />
              <strong>Precio:</strong> ${productoOriginal.precio}
              <br />
              <strong>Stock:</strong> {productoOriginal.stock}
              <br />
              <strong>Categoría:</strong> {productoOriginal.categoria_nombre}
            </Card.Body>
          </Card>
        </Col>

        {/* 🔹 Columna derecha: Formulario de edición */}
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Editar Producto</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={productoEditado.nombre}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea" // ⬅️ Cambiado a 'textarea' para mejor edición
                    name="descripcion"
                    value={productoEditado.descripcion}
                    onChange={handleChange}
                    style={{
                      maxHeight: "250px", // ⬅️ Aumentado el height para mejor edición
                      resize: "vertical", // ⬅️ Permite expandir solo en vertical
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={productoEditado.precio}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={productoEditado.stock}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleSave}>
                  Guardar Cambios
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditarProducto;
