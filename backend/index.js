require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("./middlewares/logger");

const app = express();
app.use(logger);
app.use(cors());
app.use(express.json());

// 🔹 Importar rutas desde la carpeta "routes"
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const listarUsuarios = require("./routes/listarUsuarios");
const editarUsuarios = require("./routes/editarUsuario");
const eliminarUsuario = require("./routes/eliminarUsuario");

// 🔹 Usar las rutas con el prefijo "/api"
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", listarUsuarios); 
app.use("/api", editarUsuarios); 

// 🔹 Servir archivos estáticos de React (asegúrate de que el frontend está en "frontend/dist")
app.use(express.static(path.join(__dirname, "frontend", "dist")));
// 🔹 Redirigir todas las rutas desconocidas al index.html de React
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
