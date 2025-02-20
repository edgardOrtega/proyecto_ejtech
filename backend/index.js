require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

// 🔹 Usar las rutas con el prefijo "/api"
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});