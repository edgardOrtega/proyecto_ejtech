const express = require("express");
const pool = require("../db");

const router = express.Router();

// 🔹 Obtener todas las categorías
router.get("/categorias", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM categoria ORDER BY id_categoria ASC");
        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/categorias:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
