const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/editarProducto/:id_producto", async (req, res) => {
  const id_producto = parseInt(req.params.id_producto, 10);

  console.log("🔹 ID recibido en backend:", id_producto);

  if (isNaN(id_producto)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const result = await pool.query(
      `SELECT p.*, c.nombre AS categoria_nombre
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = $1`,
      [id_producto]
    );
    console.log("🔹 Resultado de la consulta:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener el producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Editar un producto (sin actualizar la categoría)
router.put("/editarProducto/:id_producto", async (req, res) => {
    const id_producto = parseInt(req.params.id_producto, 10);
    const { nombre, descripcion, precio, stock } = req.body; // ❌ Eliminar `id_categoria`
  
    if (isNaN(id_producto)) {
      return res.status(400).json({ error: "ID inválido" });
    }
  
    try {
      const result = await pool.query(
        "UPDATE producto SET nombre = $1, descripcion = $2, precio = $3, stock = $4, actualizado_en = CURRENT_TIMESTAMP WHERE id_producto = $5 RETURNING *",
        [nombre, descripcion, precio, stock, id_producto] // ❌ Ya no pasamos `id_categoria`
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
  
      res.json({
        message: "Producto actualizado correctamente",
        producto: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Error al actualizar el producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

module.exports = router;
