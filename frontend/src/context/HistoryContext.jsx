import React, { createContext, useContext, useState, useEffect } from "react";

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const addToHistory = (cart) => {
    if (!Array.isArray(cart) || cart.length === 0) {
      console.error("❌ Error: Intento de agregar un carrito vacío al historial.");
      return;
    }

    const newPurchase = {
      id: new Date().getTime(),
      date: new Date().toLocaleString(),
      products: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    setHistory((prev) => [...prev, newPurchase]);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
