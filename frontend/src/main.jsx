import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter as Router } from "react-router-dom"; // Importa HashRouter
import { AuthProvider } from "./context/AuthContext";  
import { CartProvider } from "./context/CartContext";  
import { HistoryProvider } from "./context/HistoryContext";  

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router> {/* Usa HashRouter en lugar de BrowserRouter */}
      <AuthProvider>  
        <CartProvider>  
          <HistoryProvider>  
            <App />
          </HistoryProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
