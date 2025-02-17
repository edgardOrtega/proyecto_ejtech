import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Intentamos recuperar el usuario desde localStorage al cargar la app
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await fetch("/data/listadoUsuarios.json");
      const users = await response.json();

      const foundUser = users.find(
        (u) => u.Email === email && u.Password === password
      );

      if (foundUser && foundUser.Activo) {
        const userData = { userName: foundUser.userName, rol: foundUser.Rol };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Guardamos en localStorage
        return { success: true, rol: foundUser.Rol };
      } else {
        return { success: false, message: "Credenciales incorrectas o usuario inactivo." };
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return { success: false, message: "Error en el servidor." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Eliminamos la sesión
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
