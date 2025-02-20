const express = require("express");
const pool = require("../db");

const router = express.Router();

// 🔹 Obtener roles disponibles
router.get("/roles", async (req, res) => {
    try {
        const result = await pool.query("SELECT id_rol, nombre FROM rol ORDER BY id_rol ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("🚨 Error al obtener roles:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
