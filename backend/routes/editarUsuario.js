const express = require("express");
const pool = require("../db");

const router = express.Router();

// Obtener un usuario por ID
router.get("/editarUsuario/:id_usuario", async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario, 10);
        if (isNaN(id_usuario)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        const userResult = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id_usuario]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(userResult.rows[0]);
    } catch (error) {
        console.error("🚨 Error obteniendo usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Editar un usuario
router.put("/EditarUsuario/:id_usuario", async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario, 10);
        const { userName, Email, Password, Rol, Activo } = req.body;

        if (isNaN(id_usuario)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        const updateQuery = `
            UPDATE usuarios 
            SET userName = $1, Email = $2, Password = $3, Rol = $4, Activo = $5 
            WHERE id = $6 RETURNING *;
        `;
        const values = [userName, Email, Password, Rol, Activo, id_usuario];

        const result = await pool.query(updateQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario actualizado correctamente", user: result.rows[0] });
    } catch (error) {
        console.error("🚨 Error actualizando usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


module.exports = router;
