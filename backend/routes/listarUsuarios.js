const express = require("express");
const pool = require("../db");

const router = express.Router();

// 🔹 Obtener todos los productos
router.get("/listarUsuarios", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM usuario ORDER BY id_usuario ASC");
        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/productos:", error);
        res.status(500).json({ error: error.message });
    }
});

router.delete("/listarUsuarios/:id_usuario", async (req, res) => {
    const id_usuario = parseInt(req.params.id_usuario, 10);
  
    if (isNaN(id_usuario)) {
      console.error("ID de usuario inválido:", req.params.id_usuario);
      return res.status(400).json({ error: "ID de usuario inválido" });
    }
  
    try {
      const result = await pool.query("DELETE FROM usuario WHERE id_usuario = $1", [id_usuario]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      console.log(`Usuario con ID ${id_usuario} eliminado correctamente`);
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("🚨 Error eliminando usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  router.get("/listarUsuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("🚨 Error en /listarUsuarios/:id:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
