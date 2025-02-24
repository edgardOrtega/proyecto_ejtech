import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import imagenCreador1 from "../assets/edgard.png";
import imagenCreador2 from "../assets/joaquin.png";
const Ejtech = () => {
  return (
    <Container className="text-center p-5">
      <h1 className="mb-4">Alcance del Proyecto de Compras</h1>
      <p className="lead">
        Nuestro proyecto de compras busca ofrecer una experiencia fluida y eficiente para los usuarios,
        permitiéndoles explorar productos, agregarlos al carrito y realizar pagos de manera sencilla.
      </p>
      
      <Row className="justify-content-center mt-4">
        <Col md={4} className="d-flex justify-content-center">
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={imagenCreador1} alt="Creador 1" />
            <Card.Body>
              <Card.Title>Edgard Ortega</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="d-flex justify-content-center">
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={imagenCreador2} alt="Creador 2" />
            <Card.Body>
              <Card.Title>Joaquín López</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ejtech;
