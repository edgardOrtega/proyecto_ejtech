import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Spinner, Alert, InputGroup, FormControl } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Carrito = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:3000/api/carrito", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el carrito.");
        setLoading(false);
      });
  }, [user]);

  // 🔹 Formato de CLP con separadores de miles
  const formatoCLP = (valor) => {
    return `$${Number(valor).toLocaleString("es-CL")}`;
  };

  // 🔹 Función para eliminar un producto
  const handleRemove = async (id_producto) => {
    try {
      await fetch(`http://localhost:3000/api/carrito/${id_producto}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCart(cart.filter((item) => item.id_producto !== id_producto));
      Swal.fire("Eliminado", "Producto eliminado del carrito", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  // 🔹 Función para vaciar todo el carrito
  const handleClearCart = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/carrito", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo vaciar el carrito");
      }

      setCart([]); // ✅ Vaciar el carrito en el frontend inmediatamente
      Swal.fire("Carrito vaciado", "Todos los productos han sido eliminados", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // 🔹 Función para actualizar la cantidad de un producto en el carrito
  const handleUpdateQuantity = async (id_producto, newQuantity, stockDisponible) => {
    if (newQuantity < 1 || newQuantity > stockDisponible) return;

    try {
      const response = await fetch("http://localhost:3000/api/carrito", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id_producto, cantidad: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar la cantidad");
      }

      // ✅ Actualizar la cantidad en el estado del carrito
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id_producto === id_producto ? { ...item, cantidad: newQuantity } : item
        )
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la cantidad", "error");
    }
  };

  return (
    <Container className="mt-5 text-center">
      <h2 className="fw-bold mb-4">LISTADO DEL CARRITO</h2>

      {loading ? (
        <Spinner animation="border" className="d-block mx-auto" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : cart.length > 0 ? (
        <>
          {cart.map((product) => (
            <Row key={product.id_producto} className="my-3 mx-auto p-3 shadow-sm rounded-3"
              style={{ border: "3px solid yellow", maxWidth: "750px" }}>
              <Col md={2} className="text-center">
                <img src={product.imagen} alt={product.nombre} className="img-fluid" style={{ maxWidth: "100px" }} />
              </Col>

              <Col md={4}>
                <h5 className="fw-bold">{product.nombre.toUpperCase()}</h5>
                <p><strong>Precio unitario:</strong> {formatoCLP(product.precio)}</p>
                <p className="fw-bold text-success">Subtotal: {formatoCLP(product.precio * product.cantidad)}</p>
              </Col>

              {/* 🔹 Botones para modificar cantidad */}
              <Col md={3} className="text-center">
                <InputGroup>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleUpdateQuantity(product.id_producto, product.cantidad - 1, product.stock)}
                    disabled={product.cantidad <= 1}
                  >
                    -
                  </Button>
                  <FormControl className="text-center" value={product.cantidad} readOnly />
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleUpdateQuantity(product.id_producto, product.cantidad + 1, product.stock)}
                    disabled={product.cantidad >= product.stock}
                  >
                    +
                  </Button>
                </InputGroup>
              </Col>

              <Col md={3} className="text-center">
                <Button variant="danger" onClick={() => handleRemove(product.id_producto)}>Eliminar</Button>
              </Col>
            </Row>
          ))}

          <Row className="mt-4">
            <Col>
              <h4 className="fw-bold text-success">
                Total: {formatoCLP(cart.reduce((total, product) => total + product.precio * product.cantidad, 0))}
              </h4>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button variant="secondary" className="boton-vaciar" onClick={handleClearCart}>
              Vaciar Carrito
            </Button>

            <Button variant="success" className="boton-comprar">
              Comprar
            </Button>
          </div>

        </>
      ) : (
        <h5 className="text-center mt-4">No hay productos en el carrito</h5>
      )}
    </Container>
  );
};

export default Carrito;
