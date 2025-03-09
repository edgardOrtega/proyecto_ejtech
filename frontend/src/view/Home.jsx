import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import grupoImage from "../assets/grupo.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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
            Nuestra plataforma digital revoluciona la forma en que interactúas con la tecnología. 
            Con soluciones innovadoras, conectividad en tiempo real y herramientas intuitivas, 
            facilitamos la digitalización y el crecimiento de tu negocio en el mundo digital.
          </p>
          <Button 
            className="mt-3 d-block d-md-inline" 
            style={{ backgroundColor: "#fefe00", color: "black", border: "none", fontWeight: "bold" }}
            onClick={() => navigate("/Ejtech")}
          >
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
