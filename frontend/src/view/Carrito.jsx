import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Spinner, Alert, InputGroup, FormControl } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 

const Carrito = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchCart } = useCart(); // 🔥 Importar actualización del carrito en navbar
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL; // Para Vite

  useEffect(() => {
    if (!user) return;

    fetch(`${apiUrl}/api/carrito`, {
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

  const formatoCLP = (valor) => {
    return `$${Number(valor).toLocaleString("es-CL")}`;
  };

  const handleRemove = async (id_producto) => {
    try {
      await fetch(`${apiUrl}/api/carrito/${id_producto}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCart(cart.filter((item) => item.id_producto !== id_producto));
      fetchCart(); // 🔄 Actualiza la navbar
      Swal.fire("Eliminado", "Producto eliminado del carrito", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  const handleClearCart = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminarán todos los productos del carrito",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, vaciar carrito",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await fetch(`${apiUrl}/api/carrito`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("No se pudo vaciar el carrito");
      }

      setCart([]);
      fetchCart(); // 🔄 Actualiza la navbar
      Swal.fire("Carrito vaciado", "Todos los productos han sido eliminados", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleUpdateQuantity = async (id_producto, newQuantity, stockDisponible) => {
    if (newQuantity < 1 || newQuantity > stockDisponible) return;

    try {
      const response = await fetch(`${apiUrl}/api/carrito`, {
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

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id_producto === id_producto ? { ...item, cantidad: newQuantity } : item
        )
      );
      fetchCart(); // 🔄 Actualiza la navbar
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la cantidad", "error");
    }
  };

  const handlePurchase = async () => {
    if (cart.length === 0) {
      Swal.fire("Error", "No hay productos en el carrito", "error");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    try {
      const response = await fetch(`${apiUrl}/api/orden`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ total, productos: cart }),
      });

      if (!response.ok) {
        throw new Error("No se pudo procesar la compra");
      }

      Swal.fire({
        title: "Compra exitosa",
        text: "Tu compra ha sido registrada correctamente",
        icon: "success",
      }).then(() => {
        setCart([]);
        fetchCart(); // 🔄 Actualiza la navbar
        navigate("/Historial");
      });

    } catch (error) {
      Swal.fire("Error", error.message, "error");
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

              <Col md={3} className="text-center "> 
                <Button variant="danger" className="mt-2" onClick={() => handleRemove(product.id_producto)}>Eliminar</Button>
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

            <Button variant="success" className="boton-comprar" onClick={handlePurchase}>
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
