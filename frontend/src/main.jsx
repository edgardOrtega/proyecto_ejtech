import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { HistoryProvider } from "./context/HistoryContext"; // 👈 Importar HistoryProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <HistoryProvider> {/* 👈 Envuelve la app con HistoryProvider */}
          
          <App />
        </HistoryProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
