import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Carrito = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handlePurchase = async () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    try {
      const response = await fetch("http://localhost:3000/api/orden", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ total, productos: cart }),
      });

      if (!response.ok) throw new Error("Error al procesar la compra");

      Swal.fire({
        title: "Compra exitosa",
        text: "Tu compra ha sido registrada correctamente",
        icon: "success",
      }).then(() => {
        setCart([]);
        navigate("/historial");
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo procesar la compra", "error");
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
          {cart.map((product) => {
            const subtotal = product.precio * product.cantidad;

            return (
              <Row key={product.id_producto} className="my-3 mx-auto p-3 shadow-sm rounded-3"
                style={{ border: "3px solid yellow", maxWidth: "750px" }}>
                <Col md={2} className="text-center">
                  <img src={product.imagen} alt={product.nombre} className="img-fluid" style={{ maxWidth: "100px" }} />
                </Col>

                <Col md={4}>
                  <h5 className="fw-bold">{product.nombre.toUpperCase()}</h5>
                  <p><strong>Precio unitario:</strong> {formatoCLP(product.precio)}</p>
                  <p className="fw-bold text-success">Subtotal: {formatoCLP(subtotal)}</p>
                </Col>

                <Col md={3} className="text-center">
                  <p className="fw-bold">Cantidad: {product.cantidad}</p>
                </Col>

                <Col md={3} className="text-center">
                  <Button variant="danger" onClick={() => handleRemove(product.id_producto)}>Eliminar</Button>
                </Col>
              </Row>
            );
          })}

          <Row className="mt-4">
            <Col>
              <h4 className="fw-bold text-primary">
                Total: {formatoCLP(cart.reduce((total, product) => total + product.precio * product.cantidad, 0))}
              </h4>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button variant="success" className="ms-3" onClick={handlePurchase}>
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
