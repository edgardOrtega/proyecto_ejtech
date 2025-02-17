import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(0);

  // 🔹 Sincronizar con el carrito al cargar el componente
  useEffect(() => {
    const itemEnCarrito = cart.find((item) => item.id === product.id);
    if (itemEnCarrito) {
      setQuantity(itemEnCarrito.quantity);
    }
  }, [cart, product.id]);

  // 🔹 Función para formatear CLP sin decimales y en el formato correcto
  const formatoCLP = (valor) => {
    return `$${Number(valor).toLocaleString("es-CL", { minimumFractionDigits: 0 })}`;
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      addToCart({ ...product, quantity: newQuantity });
    }
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      addToCart({ ...product, quantity: newQuantity });
    }
  };

  return (
    <Card className="m-3 p-3 shadow-lg" style={{ border: "2px solid yellow" }}>
      <Card.Img variant="top" src={product.image} alt={product.name} />
      <Card.Body>
        <Card.Title className="fw-bold text-center">{product.name.toUpperCase()}</Card.Title>
        <Card.Text>
          <strong>Descripción:</strong> {product.description}
        </Card.Text>
        <Card.Text>
          <strong>Precio:</strong> {formatoCLP(product.price)}
        </Card.Text>
        <Card.Text>
          <strong>Stock:</strong> {product.stock}
        </Card.Text>
        <div className="d-flex justify-content-center align-items-center">
          <Button variant="dark" onClick={handleDecrease} disabled={quantity <= 0}>
            -
          </Button>
          <span className="mx-2 fw-bold">{quantity}</span>
          <Button variant="dark" onClick={handleIncrease} disabled={quantity >= product.stock}>
            +
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
