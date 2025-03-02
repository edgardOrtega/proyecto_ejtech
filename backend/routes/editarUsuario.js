const express = require("express");
const pool = require("../db");
const bcrypt = require("bcryptjs");
const router = express.Router();



router.get("/editarUsuario/:id_usuario", async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario, 10);

        if (isNaN(id_usuario)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        // Buscar usuario en la base de datos
        const result = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1", [id_usuario]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(result.rows[0]); // Enviar datos del usuario
    } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



// Editar un usuario
router.put("/editarUsuario/:id_usuario", async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario, 10);
        let { username, email, password, id_rol, activo } = req.body;

        if (isNaN(id_usuario)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        id_rol = parseInt(id_rol, 10);
        activo = activo === "true" || activo === true;

        // Verificar si el usuario existe
        const currentUser = await pool.query("SELECT password FROM usuario WHERE id_usuario = $1", [id_usuario]);

        if (currentUser.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Si se envía una nueva contraseña, encriptarla; si no, mantener la actual
        let hashedPassword = currentUser.rows[0].password;
        if (password && password.trim() !== "") {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Actualizar el usuario
        const updateQuery = `
            UPDATE usuario
            SET username = $1, email = $2, password = $3, id_rol = $4, activo = $5, actualizado_en = NOW()
            WHERE id_usuario = $6 RETURNING *;
        `;
        const values = [username, email, hashedPassword, id_rol, activo, id_usuario];

        const result = await pool.query(updateQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario actualizado correctamente", user: result.rows[0] });
    } catch (error) {
        console.error(" Error actualizando usuario:", error);
        res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
});


module.exports = router;
