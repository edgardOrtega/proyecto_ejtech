const express = require("express");
const pool = require("../db");

const router = express.Router();


router.get("/listarProductos", async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock, 
                   c.nombre AS categoria, p.imagen, p.creado_en, p.actualizado_en
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            ORDER BY p.id_producto ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/listarProductos:", error);
        res.status(500).json({ error: error.message });
    }
});


// ✅ Ruta para eliminar un producto por ID
router.delete("/listarProductos/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        // ✅ Convierte el id a número si es necesario
        const result = await pool.query("DELETE FROM producto WHERE id_producto = $1 RETURNING *", [Number(id)]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente", producto: result.rows[0] });
    } catch (error) {
        console.error("🚨 Error al eliminar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;