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
      await pool.query("BEGIN"); // Iniciar transacción

      // 1️⃣ Eliminar del carrito (clave foránea de usuario)
      await pool.query("DELETE FROM carrito WHERE id_usuario = $1", [id_usuario]);

      // 2️⃣ Eliminar detalles de ordenes relacionadas al usuario
      await pool.query(`
          DELETE FROM detalle_orden 
          WHERE id_orden IN (SELECT id_orden FROM orden WHERE id_usuario = $1)
      `, [id_usuario]);

      // 3️⃣ Eliminar las órdenes del usuario
      await pool.query("DELETE FROM orden WHERE id_usuario = $1", [id_usuario]);

      // 4️⃣ Eliminar el usuario
      const result = await pool.query("DELETE FROM usuario WHERE id_usuario = $1", [id_usuario]);

      if (result.rowCount === 0) {
          await pool.query("ROLLBACK"); // Revertir si el usuario no existe
          return res.status(404).json({ error: "Usuario no encontrado" });
      }

      await pool.query("COMMIT"); // Confirmar cambios
      console.log(`✅ Usuario con ID ${id_usuario} eliminado correctamente`);
      res.status(200).json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
      await pool.query("ROLLBACK"); // Revertir en caso de error
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
