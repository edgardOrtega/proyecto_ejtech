require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
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

// 🔹 Definir rutas de la API
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

// 🔹 Manejar el frontend de React
const frontendPath = path.join(__dirname, "frontend", "dist");
const indexPath = path.join(frontendPath, "index.html");

// Servir archivos estáticos del frontend
if (fs.existsSync(indexPath)) {
    app.use(express.static(frontendPath));

    // 🔹 Manejar todas las rutas desconocidas con React (para soportar F5 y rutas directas)
    app.get("*", (req, res) => {
        if (req.originalUrl.startsWith("/api")) {
            return res.status(404).json({ error: "Ruta de API no encontrada" });
        }
        res.sendFile(indexPath, (err) => {
            if (err) {
                res.status(500).send("Error al cargar la aplicación");
            }
        });
    });
} else {
    console.error("⚠️ No se encontró el frontend en 'frontend/dist'. Ejecuta 'npm run build' en el frontend.");
}

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});