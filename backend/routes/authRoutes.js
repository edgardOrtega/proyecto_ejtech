const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// Registro de usuario
router.post("/registro", async (req, res) => {
    try {
        const { username, email, password, fecha_nacimiento, id_rol } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO usuario (username, email, password, fecha_nacimiento, id_rol) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, username, email, id_rol;
        `;
        const values = [username, email, hashedPassword, fecha_nacimiento, id_rol];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(" Error en /api/registro:", error);
        res.status(500).json({ error: error.message });
    }
});

//  Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query(
            `SELECT u.id_usuario, u.email, u.password, u.id_rol,u.username, r.nombre AS nombre_rol 
             FROM usuario u 
             JOIN rol r ON u.id_rol = r.id_rol 
             WHERE u.email = $1`,
            [email]
        );

        if (userResult.rowCount === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Credenciales incorrectas" });

        const token = jwt.sign(
            {
                id_usuario: user.id_usuario,
                email: user.email,
                username:user.username,
                id_rol: user.id_rol,
                nombre_rol: user.nombre_rol?.trim() || "Usuario",
            },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.json({ success: true, token, id_usuario: user.id_usuario, email: user.email,username: user.username, rol: user.id_rol, nombre_rol: user.nombre_rol?.trim() || "Usuario" });

    } catch (error) {
        console.error(" Error en /api/login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
