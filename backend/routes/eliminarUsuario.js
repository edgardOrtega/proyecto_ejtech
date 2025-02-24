const express = require("express");
const pool = require("../db");

const router = express.Router();


router.delete("/listarUsuarios/:id_usuario", async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario, 10);
        if (isNaN(id_usuario)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error eliminando usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


module.exports = router;