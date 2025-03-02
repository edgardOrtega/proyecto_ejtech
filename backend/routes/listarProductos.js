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


// Ruta para eliminar un producto por ID
router.delete("/listarProductos/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Inicia una transacción para asegurarte de que todo se elimine correctamente
        await pool.query("BEGIN");

        // 1️⃣ Eliminar registros en detalle_orden donde id_producto es el producto a eliminar
        await pool.query("DELETE FROM detalle_orden WHERE id_producto = $1", [id]);

        // 2️⃣ Eliminar registros en carrito donde id_producto es el producto a eliminar
        await pool.query("DELETE FROM carrito WHERE id_producto = $1", [id]);

        // 3️⃣ Eliminar el producto
        const result = await pool.query("DELETE FROM producto WHERE id_producto = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            await pool.query("ROLLBACK"); // Revierte la transacción si no se encontró el producto
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Confirma la transacción
        await pool.query("COMMIT");

        res.json({ message: "Producto eliminado correctamente", producto: result.rows[0] });
    } catch (error) {
        await pool.query("ROLLBACK"); // Revierte la transacción en caso de error
        console.error("🚨 Error al eliminar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



module.exports = router;