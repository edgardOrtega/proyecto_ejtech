import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useHistory } from "../context/HistoryContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Carrito = ({ actualizarStock }) => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { addToHistory } = useHistory();
  const navigate = useNavigate();

  const handleRemove = (product) => {
    actualizarStock(product.id, product.quantity);
    removeFromCart(product.id);
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción vaciará todo tu carrito.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, vaciar carrito",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        cart.forEach((product) => {
          actualizarStock(product.id, product.quantity);
        });
        clearCart();
        Swal.fire("¡Carrito vaciado!", "Todos los productos han sido eliminados.", "success");
      }
    });
  };

  const handlePurchase = () => {
    if (cart.length === 0) return;

    addToHistory(cart);
    Swal.fire({
      title: "¡Compra realizada con éxito!",
      text: "Tu compra ha sido registrada correctamente.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      clearCart();
      navigate("/historial");
    });
  };

  const formatoCLP = (valor) => `$${Number(valor).toLocaleString("es-CL", { minimumFractionDigits: 0 })}`;

  const totalCompra = cart.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <Container className="mt-5 text-center">
      <h2 className="fw-bold mb-4">LISTADO DEL CARRITO</h2>

      {cart.length > 0 ? (
        <>
          {cart.map((product) => {
            const subtotal = product.price * product.quantity;

            return (
              <Row key={product.id} className="my-3 mx-auto p-3 shadow-sm rounded-3"
                style={{ border: "3px solid yellow", maxWidth: "750px" }}>
                <Col md={2} className="text-center">
                  <img src={product.image} alt={product.name} className="img-fluid" style={{ maxWidth: "100px" }} />
                </Col>

                <Col md={4}>
                  <h5 className="fw-bold">{product.name.toUpperCase()}</h5>
                  <p><strong>Precio unitario:</strong> {formatoCLP(product.price)}</p>
                  <p className="fw-bold text-success">Subtotal: {formatoCLP(subtotal)}</p>
                </Col>

                <Col md={3} className="text-center">
                  <Button variant="light" onClick={() => updateQuantity(product.id, product.quantity - 1)} disabled={product.quantity <= 1}>-</Button>
                  <span className="mx-2 fw-bold">{product.quantity}</span>
                  <Button variant="light" onClick={() => updateQuantity(product.id, product.quantity + 1)} disabled={product.quantity >= product.stock}>+</Button>
                </Col>

                <Col md={3} className="text-center">
                  <Button variant="danger" onClick={() => handleRemove(product)}>Eliminar</Button>
                </Col>
              </Row>
            );
          })}

          <Row className="mt-4">
            <Col>
              <h4 className="fw-bold text-primary">Total: {formatoCLP(totalCompra)}</h4>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button variant="dark" onClick={handleClearCart}>Vaciar Carrito</Button>
            <Button variant="success" className="ms-3" onClick={handlePurchase}>Comprar</Button>
          </div>
        </>
      ) : (
        <h5 className="text-center mt-4">No hay productos en el carrito</h5>
      )}
    </Container>
  );
};

export default Carrito;
