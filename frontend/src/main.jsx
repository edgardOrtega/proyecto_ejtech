import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  // ✅ Debe ir primero
import { CartProvider } from "./context/CartContext";  
import { HistoryProvider } from "./context/HistoryContext";  

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>  {/* ✅ Primero el AuthProvider */}
        <CartProvider>  {/* ✅ Luego el CartProvider */}
          <HistoryProvider>  {/* ✅ Luego el HistoryProvider */}
            <App />
          </HistoryProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
