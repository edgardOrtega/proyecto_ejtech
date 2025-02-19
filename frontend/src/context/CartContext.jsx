import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // ✅ Cargar el carrito del usuario desde el backend al iniciar sesión
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  // ✅ Obtener el carrito desde el backend
  const fetchCart = async () => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:3000/api/carrito", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el carrito");

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  };

  // ✅ Agregar un producto al carrito (ahora con backend)
  const addToCart = async (product) => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:3000/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_producto: product.id_producto,
          cantidad: product.cantidad,
        }),
      });

      if (!response.ok) throw new Error("Error al agregar el producto al carrito");

      // Recargar el carrito después de agregar un producto
      fetchCart();
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
    }
  };

  // ✅ Actualizar la cantidad de un producto en el carrito
  const updateQuantity = async (productId, newQuantity) => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:3000/api/carrito", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_producto: productId,
          cantidad: newQuantity,
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar la cantidad del producto");

      // Recargar el carrito después de actualizar la cantidad
      fetchCart();
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    }
  };

  // ✅ Eliminar un producto del carrito
  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3000/api/carrito/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el producto del carrito");

      // Recargar el carrito después de eliminar un producto
      fetchCart();
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
    }
  };

  // ✅ Vaciar el carrito (Eliminar todos los productos del carrito)
  const clearCart = async () => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:3000/api/carrito/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al vaciar el carrito");

      setCart([]);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
