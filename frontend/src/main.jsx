import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  
import { CartProvider } from "./context/CartContext";  
import { HistoryProvider } from "./context/HistoryContext";  

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* 📌 Eliminamos `basename="/"` porque no es necesario */}
      <AuthProvider>  
        <CartProvider>  
          <HistoryProvider>  
            <App />
          </HistoryProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
