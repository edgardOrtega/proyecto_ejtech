import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import grupoImage from "../assets/grupo.png";

const Home = () => {
  return (
    <Container className="py-5">
      <Row className="align-items-center">
        {/* Sección de Texto */}
        <Col md={6} className="text-start">
          <h6 className="text-muted">A TU ALCANCE</h6>
          <h1 className="fw-bold">
            <strong>PROYECTO TECNOLÓGICO</strong>
          </h1>
          <p className="text-secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim
            nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et
            ipsum.
          </p>
          <Button style={{ backgroundColor: "#fefe00", color: "black", border: "none", fontWeight: "bold" }}>
            DESCÚBRELO
          </Button>
        </Col>

        {/* Imagen */}
        <Col md={6} className="text-center">
          <img
            src={grupoImage}
            alt="Proyecto Tecnológico"
            className="img-fluid rounded"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;