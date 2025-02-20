const express = require("express");
const pool = require("../db");

const router = express.Router();

// 🔹 Obtener todos los productos
router.get("/productos", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM producto ORDER BY id_producto ASC");
        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/productos:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
