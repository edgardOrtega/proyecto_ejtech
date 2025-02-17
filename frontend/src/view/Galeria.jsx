import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, InputGroup, FormControl } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

const Galeria = ({ actualizarStock, stockDisponible }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});

  // Cargar productos desde JSON
  useEffect(() => {
    fetch("/data/tecnologia.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const productosConID = data.map((producto, index) => ({
            ...producto,
            id: index + 1,
          }));
          setProductos(productosConID);
          setQuantities(productosConID.reduce((acc, producto) => ({ ...acc, [producto.id]: 1 }), {}));
        } else {
          setError("Los datos no tienen el formato esperado.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      });
  }, []);

  //  Función para formatear CLP sin decimales
  const formatoCLP = (valor) => `$${Number(valor).toLocaleString("es-CL", { minimumFractionDigits: 0 })}`;

  // Agregar producto al carrito
  const handleAddToCart = (product) => {
    const quantity = quantities[product.id];
    const stockRestante = stockDisponible[product.id] ?? product.stock;

    if (quantity > stockRestante) {
      Swal.fire({
        title: "Error",
        text: "No hay suficiente stock disponible",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    addToCart({ ...product, quantity });
    actualizarStock(product.id, -quantity);

    Swal.fire({
      title: "Producto añadido",
      text: `${quantity} x ${product.name} agregado al carrito`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 fw-bold">Galería de Productos</h2>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="justify-content-center">
        {!loading &&
          !error &&
          productos.map((product) => {
            const stockRestante = stockDisponible[product.id] ?? product.stock;

            return (
              <Col key={product.id} md={4} lg={3} className="mb-4">
                <Card className="shadow-sm p-3 rounded text-center" style={{ border: "3px solid yellow" }}>
                  <Card.Img variant="top" src={product.image} alt={product.name} style={{ height: "200px", objectFit: "contain" }} />
                  <Card.Body>
                    <Card.Title className="fw-bold">{product.name}</Card.Title>
                    <Card.Text className="text-muted">{product.description}</Card.Text>
                    <p className="fw-bold">Precio: {formatoCLP(product.price)}</p>
                    <p className={`fw-bold ${stockRestante === 0 ? "text-danger" : ""}`}>
                      Stock: {stockRestante}
                    </p>

                    <InputGroup className="mb-3 justify-content-center">
                      <Button 
                        variant="outline-dark" 
                        onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: Math.max(1, prev[product.id] - 1) }))}
                        disabled={quantities[product.id] <= 1}
                      >
                        -
                      </Button>
                      <FormControl className="text-center" readOnly value={quantities[product.id]} />
                      <Button 
                        variant="outline-dark" 
                        onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: prev[product.id] + 1 }))}
                        disabled={quantities[product.id] >= stockRestante}
                      >
                        +
                      </Button>
                    </InputGroup>

                    <Button variant="dark" onClick={() => handleAddToCart(product)} disabled={stockRestante === 0}>
                      {stockRestante === 0 ? "Sin Stock" : "Añadir al Carrito"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default Galeria;
