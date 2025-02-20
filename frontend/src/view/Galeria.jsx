import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, InputGroup, FormControl } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Galeria = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCart } = useCart();
  const [carrito, setCarrito] = useState({}); // 🔹 Estado para almacenar productos en el carrito
  const [quantities, setQuantities] = useState({}); // 🔹 Estado para manejar cantidades seleccionadas

  useEffect(() => {
    // 🔹 Obtener productos de la API
    fetch("http://localhost:3000/api/productos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
          setQuantities(data.reduce((acc, producto) => ({ ...acc, [producto.id_producto]: 1 }), {}));
        } else {
          setError("Los datos no tienen el formato esperado.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      });

    // 🔹 Obtener el carrito si el usuario está autenticado
    if (user) {
      fetch("http://localhost:3000/api/carrito", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const cartMap = {};
          data.forEach((item) => {
            cartMap[item.id_producto] = item.cantidad;
          });
          setCarrito(cartMap);
        });
    }
  }, [user]);

  // 🔹 Obtener el stock visual (restando la cantidad en el carrito)
  const getStockVisual = (product) => {
    return product.stock - (carrito[product.id_producto] || 0);
  };

  // 🔹 Función para añadir productos al carrito
  const handleAddToCart = async (product) => {
    if (!user) {
      Swal.fire("Error", "Debes iniciar sesión para agregar productos al carrito", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_producto: product.id_producto,
          cantidad: quantities[product.id_producto],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo agregar el producto al carrito");
      }

      Swal.fire({
        title: "Producto añadido",
        text: `${quantities[product.id_producto]} x ${product.nombre} agregado al carrito`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchCart(); // ✅ Actualiza el carrito en el contexto global
      
      // ✅ También actualiza el stock visual en el estado local
      setCarrito((prev) => ({
        ...prev,
        [product.id_producto]: (prev[product.id_producto] || 0) + quantities[product.id_producto],
      }));

    } catch (error) {
      Swal.fire({
        title: "¡Límite de stock alcanzado!",
        text: error.message,
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  // 🔹 Función para formatear CLP con separadores de miles
  const formatoCLP = (valor) => {
    return `$${Number(valor).toLocaleString("es-CL")}`;
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 fw-bold">Galería de Productos</h2>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="justify-content-center">
        {!loading &&
          !error &&
          productos.map((product) => (
            <Col key={product.id_producto} md={4} lg={3} className="mb-4">
              <Card className="shadow-sm p-3 rounded text-center" style={{ border: "3px solid yellow" }}>
                <Card.Img variant="top" src={product.imagen} alt={product.nombre} style={{ height: "200px", objectFit: "contain" }} />
                <Card.Body>
                  <Card.Title className="fw-bold">{product.nombre}</Card.Title>
                  <Card.Text className="text-muted">{product.descripcion}</Card.Text>
                  <p className="fw-bold">Precio: {formatoCLP(product.precio)}</p> {/* 🔹 Precio con formato CLP */}

                  {/* 🔹 Stock visual dinámico (sin afectar la BD) */}
                  <p className={`fw-bold ${getStockVisual(product) === 0 ? "text-danger" : ""}`}>
                    Stock: {getStockVisual(product)}
                  </p>

                  <InputGroup className="mb-3 justify-content-center">
                    <Button 
                      variant="outline-dark" 
                      onClick={() => setQuantities((prev) => ({ ...prev, [product.id_producto]: Math.max(1, prev[product.id_producto] - 1) }))}
                      disabled={quantities[product.id_producto] <= 1}
                    >
                      -
                    </Button>
                    <FormControl className="text-center" readOnly value={quantities[product.id_producto]} />
                    <Button 
                      variant="outline-dark" 
                      onClick={() => setQuantities((prev) => ({ ...prev, [product.id_producto]: prev[product.id_producto] + 1 }))}
                      disabled={quantities[product.id_producto] >= getStockVisual(product)}
                    >
                      +
                    </Button>
                  </InputGroup>

                  <Button variant="dark" onClick={() => handleAddToCart(product)} disabled={getStockVisual(product) === 0}>
                    {getStockVisual(product) === 0 ? "Sin Stock" : "Añadir al Carrito"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default Galeria;
