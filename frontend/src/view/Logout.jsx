import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext"; 

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará y volverás a la página de inicio.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); 
        navigate("/");  
        Swal.fire("Sesión cerrada", "¡Hasta pronto! 😉", "success");
      }
    });
  };

  return (
    <button 
      className="nav-link logout-button"
      onClick={handleLogout}
    >
      Cerrar Sesión
    </button>
  );
};

export default Logout;