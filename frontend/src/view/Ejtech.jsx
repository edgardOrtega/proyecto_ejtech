import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import imagenCreador1 from "../assets/edgard.png";
import imagenCreador2 from "../assets/joaquin.png";

const Ejtech = () => {
  return (
    <Container className="text-center p-5">
      <h1 className="mb-4">Alcance del Proyecto EJtec</h1>
      <p className="lead">
        Nuestro proyecto EJTECH busca ofrecer una experiencia fluida y eficiente para los usuarios,
        permitiéndoles explorar productos, agregarlos al carrito.
      </p>

      <h3 className="mb-4">Creadores</h3>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={4} className="d-flex justify-content-center mb-3">
          <Card style={{ width: '18rem', border: '2px solid #fefe00', boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)' }}>
            <Card.Img variant="top" src={imagenCreador1} alt="Creador 1" className="p-2 rounded" />
            <Card.Body className="text-center">
              <Card.Title className="fw-bold">Edgard Ortega</Card.Title>
            </Card.Body>
          </Card>
        </Col>


        <Col xs={12} md={4} className="d-flex justify-content-center mb-3">
          <Card style={{ width: '18rem', border: '2px solid #fefe00', boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)' }}>
            <Card.Img variant="top" src={imagenCreador2} alt="Creador 2" className="p-2 rounded" />
            <Card.Body className="text-center">
              <Card.Title className="fw-bold">Joaquín López</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ejtech;
