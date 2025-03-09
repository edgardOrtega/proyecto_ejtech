import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Historial = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL; // Para Vite

  useEffect(() => {
    if (!user) return;

    fetch(`${apiUrl}/api/ordenes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar las órdenes.");
        setLoading(false);
      });
  }, [user]);

  const formatoCLP = (valor) => `$${Number(valor).toLocaleString("es-CL")}`;

  return (
    <Container className="mt-5 text-center">
      <h2 className="fw-bold mb-4">HISTORIAL DE PEDIDOS</h2>

      {loading ? (
        <Spinner animation="border" className="d-block mx-auto" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : history.length > 0 ? (
        history.slice().reverse().map((order) => (
          <Card
            key={order.id_orden}
            className="mb-4 shadow-sm mx-auto p-3"
            style={{ border: "3px solid yellow", maxWidth: "750px" }}
          >
            <Card.Body>
              <Row className="align-items-center mb-3">
                <Col className="text-start">
                  <h5 className="fw-bold">NÚMERO DE ORDEN: {order.id_orden}</h5>
                </Col>
                <Col className="text-end text-muted" style={{ fontSize: "14px" }}>
                  FECHA ORDEN: {new Date(order.fecha).toLocaleString()}
                </Col>
              </Row>

              {order.productos.map((product) => (
                <Row
                  key={product.id_producto}
                  className="align-items-center mb-3 text-start flex-wrap"
                >
                  <Col xs={12} sm={3} className="text-center mb-2 mb-sm-0">
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="img-fluid"
                      style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                    />
                  </Col>
                  <Col xs={12} sm={9} className="text-sm-start text-center">
                    <p className="fw-bold mb-1" style={{ overflowWrap: "break-word" }}>{product.nombre}</p>
                    <p className="mb-1"><strong>Cantidad:</strong> {product.cantidad}</p>
                    <p className="mb-0"><strong>Subtotal:</strong> {formatoCLP(product.subtotal)}</p>
                  </Col>
                </Row>
              ))}

              <h5 className="fw-bold text-success mt-3">Total: {formatoCLP(order.total)}</h5>
              <h6 className="fw-bold mt-2">ESTADO: <span className="text-dark">{order.estado}</span></h6>
            </Card.Body>
          </Card>
        ))
      ) : (
        <h5 className="text-center mt-4">No hay compras registradas</h5>
      )}
    </Container>
  );
};

export default Historial;
