import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, InputGroup, FormControl } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart(); // 🔄 Se agrega fetchCart para actualizar el carrito en la navbar
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState({});
  const [stockDisponible, setStockDisponible] = useState(0);
  const [carritoModificado, setCarritoModificado] = useState(false); // Para cambiar color del botón "Volver"

  useEffect(() => {
    fetch(`http://localhost:3000/api/productos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProducto(data);
        setStockDisponible(data.stock);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
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

        // 🔹 Ajustar stock disponible restando los productos en carrito
        if (producto) {
          setStockDisponible(producto.stock - (cartMap[producto.id_producto] || 0));
        }
      });
  }, [producto]);

  const handleAddToCart = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_producto: producto.id_producto,
          cantidad: cantidad,
        }),
      });

      if (!response.ok) throw new Error("No se pudo agregar el producto al carrito");

      Swal.fire({
        title: "Producto añadido",
        text: `${cantidad} x ${producto.nombre} agregado al carrito`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchCart(); // 🔄 Actualiza el globito en la navbar
      setCarrito((prevCarrito) => ({
        ...prevCarrito,
        [producto.id_producto]: (prevCarrito[producto.id_producto] || 0) + cantidad,
      }));

      // 🔹 Reducir el stock disponible en la UI
      setStockDisponible((prevStock) => prevStock - cantidad);

      // 🔹 Marcar que el carrito fue modificado
      setCarritoModificado(true);

    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const formatoCLP = (valor) => {
    return `$${Number(valor).toLocaleString("es-CL")}`;
  };

  // 🔹 Definir el color del botón "Volver"
  const getVolverButtonVariant = () => {
    if (stockDisponible === 0) return "danger"; // 🔴 Sin stock
    if (carritoModificado) return "primary"; // 🔵 Producto añadido desde esta vista
    return "outline-dark"; // ⚪ Estado normal
  };

  return (
    <Container className="mt-5 detalle">
      {loading ? (
        <Spinner animation="border" className="d-block mx-auto" />
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : producto ? (
        <Card className="p-4" style={{ border: "3px solid yellow", borderRadius: "15px" }}>
          <Row className="justify-content-center align-items-center">
            {/* Izquierda: Título, Imagen y Botones */}
            <Col md={6} className="text-center d-flex flex-column align-items-center">
              <Card.Title className="fw-bold text-center fs-4 mb-3">{producto.nombre}</Card.Title>
              <Card.Img src={producto.imagen} alt={producto.nombre} className="img-fluid" style={{ maxHeight: "350px", objectFit: "contain" }} />
              <InputGroup className="mb-3 mt-3" style={{ maxWidth: "200px" }}>
                <Button
                  variant="outline-dark"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                >
                  -
                </Button>
                <FormControl className="text-center" readOnly value={cantidad} />
                <Button
                  variant="outline-dark"
                  onClick={() => setCantidad(cantidad + 1)}
                  disabled={cantidad >= stockDisponible}
                >
                  +
                </Button>
              </InputGroup>
              <Button
                variant={carrito[producto.id_producto] ? "success" : "dark"}
                className="w-100 mb-2"
                onClick={handleAddToCart}
                disabled={stockDisponible === 0}
                style={{ maxWidth: "200px" }}
              >
                {stockDisponible === 0
                  ? "Sin Stock"
                  : carrito[producto.id_producto]
                  ? `Añadidos: ${carrito[producto.id_producto]}`
                  : "Añadir al Carrito 🛒"}
              </Button>
              <Button 
                variant={getVolverButtonVariant()} // 🔥 Cambia el color dinámicamente
                className="w-100"
                onClick={() => navigate(-1)}
                style={{ maxWidth: "200px" }}
              >
                Volver ⬅️
              </Button>
            </Col>

            {/* Derecha: Precio, Stock y Descripción */}
            <Col md={6} className="d-flex flex-column justify-content-center">
              <Card.Body>
                <p className="fw-bold fs-5">Precio: {formatoCLP(producto.precio)}</p>
                <p className={`fw-bold fs-5 ${stockDisponible === 0 ? "text-danger" : "text-success"}`}>
                  Stock: {stockDisponible} unidades
                </p>
                <h5 className="fw-bold mt-3">Descripción:</h5>
                <Card.Text 
                  className="text-muted p-2" 
                  style={{ 
                    maxHeight: "400px", 
                    overflowY: "auto", 
                    border: "1px solid #ccc", 
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                    padding: "10px"
                  }}>
                  {producto.descripcion}
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ) : (
        <Alert variant="warning" className="text-center">Producto no encontrado</Alert>
      )}
    </Container>
  );
};

export default DetalleProducto;
