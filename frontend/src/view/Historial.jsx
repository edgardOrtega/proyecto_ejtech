import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useHistory } from "../context/HistoryContext";

const Historial = () => {
  const { history } = useHistory();

  //  Función para formatear CLP correctamente
  const formatoCLP = (valor) => `$${Number(valor).toLocaleString("es-CL", { minimumFractionDigits: 0 })}`;

  return (
    <Container className="mt-5 text-center">
      <h2 className="fw-bold mb-4">HISTORIAL DE PEDIDOS</h2>

      {history.length > 0 ? (
        history.slice().reverse().map((purchase) => (
          <Card
            key={purchase.id}
            className="mb-4 shadow-sm"
            style={{
              border: "3px solid yellow",
              maxWidth: "750px",
              margin: "0 auto",
              padding: "20px",
            }}
          >
            <Card.Body>
              {/*  Número de orden y fecha */}
              <Row className="align-items-center mb-3">
                <Col className="text-start">
                  <h5 className="fw-bold">NÚMERO DE ORDEN: {purchase.id}</h5>
                </Col>
                <Col className="text-end text-muted" style={{ fontSize: "14px" }}>
                  FECHA ORDEN: {purchase.date}
                </Col>
              </Row>

              {/* Listado de productos */}
              {purchase.products.map((product) => {
                const subtotal = product.price * product.quantity; // Calcular subtotal

                return (
                  <Row key={product.id} className="align-items-center mb-3 text-start">
                    <Col xs={3} className="text-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid"
                        style={{ maxWidth: "100px", height: "auto" }}
                      />
                    </Col>
                    <Col xs={9}>
                      <p className="fw-bold">{product.name}</p>
                      <p className="text-muted">{product.description}</p>
                      <p><strong>Cantidad:</strong> {product.quantity}</p>
                      <p><strong>Subtotal:</strong> {formatoCLP(subtotal)}</p>
                    </Col>
                  </Row>
                );
              })}

              {/* 🔹 Total y estado */}
              <h5 className="fw-bold text-success mt-3">Total: {formatoCLP(purchase.total)}</h5>
              <h6 className="fw-bold mt-2">ESTADO: <span className="text-dark">Orden entregada</span></h6>
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
