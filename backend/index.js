require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Para verificar si el frontend está correctamente construido
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
const editarProductos = require("./routes/editarProducto");
const listarProductos = require("./routes/listarProductos");
const categoryRoutes = require("./routes/categoryRoutes");

// Usar las rutas con el prefijo "/api"
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", listarUsuarios);
app.use("/api", listarProductos);
app.use("/api", editarUsuarios);
app.use("/api", categoryRoutes);
app.use("/api", editarProductos);

// 🔹 Verificar si el frontend está correctamente construido
const frontendPath = path.join(__dirname, "frontend", "dist");
const indexPath = path.join(frontendPath, "index.html");

if (fs.existsSync(indexPath)) {
    // Servir archivos estáticos de React solo si el build existe
    app.use(express.static(frontendPath));

    // Redirigir todas las rutas desconocidas al index.html de React
    app.get("*", (req, res) => {
        res.sendFile(indexPath);
    });
} else {
    console.error("⚠️ No se encontró el frontend en 'frontend/dist'. Asegúrate de ejecutar 'npm run build' en el frontend.");
}

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
