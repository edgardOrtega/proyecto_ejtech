require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("./middlewares/logger");
const { registrarUsuario } = require("./consultas"); // consulta para registro
const { verificarUsuario } = require("./consultas"); // consulta para login

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para procesar JSON

app.use(logger);

// Ruta para registrar usuario
app.post("/api/registro", async (req, res) => {
    try {
        const nuevoUsuario = await registrarUsuario(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para login
app.post("/api/usuarios", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const usuario = await verificarUsuario(email);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        // Comparar la contraseña con la almacenada
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) return res.status(401).json({ error: "Credenciales incorrectas" });

        // Crear token JWT
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, email: usuario.email, id_rol: usuario.id_rol },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});