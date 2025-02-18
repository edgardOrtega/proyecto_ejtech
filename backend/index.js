require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { registrarUsuario } = require("./consultas");
const logger = require("./middlewares/logger");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para procesar JSON

app.use(logger);
// Ruta para registrar usuario
app.post("/api/usuarios", async (req, res) => {
    try {
        const nuevoUsuario = await registrarUsuario(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});