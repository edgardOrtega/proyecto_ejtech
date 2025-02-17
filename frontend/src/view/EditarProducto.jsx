import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, Button, Form, Spinner, Row, Col } from "react-bootstrap"; // Importamos Card, Form y Button

const JSON_FILE = "/data/tecnologia.json"; // Ruta del JSON

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
        const response = await axios.get(JSON_FILE);
        console.log("Datos obtenidos:", response.data);
        console.log("ID recibido:", id);

        const product = response.data.find((prod) => prod.id.toString() === id);

        if (!product) {
          throw new Error("Producto no encontrado");
        }

        setProductoOriginal(product);
        setProductoEditado({ ...product }); // Copiamos el producto original
      } catch (err) {
        setError(err.message);
        Swal.fire("Error", "Producto no encontrado", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado({ ...productoEditado, [name]: value });
  };

  const handleSave = () => {
    Swal.fire({
      title: "¿Guardar cambios?",
      text: "¿Deseas actualizar la información del producto?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Datos actualizados:", productoEditado);
        Swal.fire("Guardado!", "Los cambios han sido guardados.", "success");
        navigate("/"); // Redirigir a la lista de productos
      }
    });
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center">Editar Producto</h2>

      <Row className="mt-4">
        {/* Card del Producto Original */}
        <Col md={6}>
          <Card className="shadow">
            <Card.Img variant="top" src={productoOriginal.image} style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}    />
            <Card.Body>
              <Card.Title>{productoOriginal.name}</Card.Title>
              <Card.Text>
                <strong>Descripción:</strong> {productoOriginal.description}
                <br />
                <strong>Precio:</strong> ${productoOriginal.price}
                <br />
                <strong>Stock:</strong> {productoOriginal.stock}
                <br />
                <strong>Categoría:</strong> {productoOriginal.category}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Card para Editar Producto */}
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Editar Producto</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productoEditado.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={productoEditado.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={productoEditado.price}
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

                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={productoEditado.category}
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
