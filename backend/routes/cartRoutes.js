const express = require("express");
const pool = require("../db");
const verificarToken = require("../authMiddleware");

const router = express.Router();

// ✅ RUTA: Obtener el carrito del usuario autenticado
router.get("/carrito", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;
        const { rows } = await pool.query(
            `SELECT c.id_producto, p.nombre, p.precio, c.cantidad, p.stock, p.imagen 
             FROM carrito c 
             JOIN producto p ON c.id_producto = p.id_producto 
             WHERE c.id_usuario = $1`,
            [id_usuario]
        );
        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/carrito:", error);
        res.status(500).json({ error: "Error al obtener el carrito." });
    }
});

// ✅ RUTA: Agregar productos al carrito con verificación correcta de stock
router.post("/carrito", verificarToken, async (req, res) => {
    try {
        const { id_producto, cantidad } = req.body;
        const id_usuario = req.user.id_usuario;

        // 🔹 Obtener el stock disponible del producto
        const productoExistente = await pool.query("SELECT stock FROM producto WHERE id_producto = $1", [id_producto]);

        if (productoExistente.rowCount === 0) {
            return res.status(400).json({ error: "El producto no existe." });
        }

        const stockDisponible = productoExistente.rows[0].stock;

        // 🔹 Obtener la cantidad ACTUAL en el carrito del usuario
        const checkCart = await pool.query(
            "SELECT cantidad FROM carrito WHERE id_usuario = $1 AND id_producto = $2",
            [id_usuario, id_producto]
        );

        const cantidadEnCarrito = checkCart.rowCount > 0 ? checkCart.rows[0].cantidad : 0;
        const nuevaCantidadTotal = cantidadEnCarrito + cantidad;

        // ✅ **Verificar correctamente el stock**
        if (nuevaCantidadTotal > stockDisponible) {
            return res.status(400).json({
                error: `No puedes agregar ${cantidad} unidades. Actualmente tienes ${cantidadEnCarrito} en el carrito y el stock disponible es ${stockDisponible}.`,
            });
        }

        // ✅ **Si el producto ya está en el carrito, actualizar la cantidad**
        if (checkCart.rowCount > 0) {
            await pool.query(
                "UPDATE carrito SET cantidad = cantidad + $1 WHERE id_usuario = $2 AND id_producto = $3",
                [cantidad, id_usuario, id_producto]
            );
        } else {
            // ✅ **Si no está en el carrito, insertarlo**
            await pool.query(
                "INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES ($1, $2, $3)",
                [id_usuario, id_producto, cantidad]
            );
        }

        res.json({ success: true, message: "Producto agregado al carrito correctamente" });

    } catch (error) {
        console.error("🚨 Error en /api/carrito:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// ✅ RUTA: Actualizar cantidad de un producto en el carrito
router.put("/carrito", verificarToken, async (req, res) => {
    try {
        const { id_producto, cantidad } = req.body;
        const id_usuario = req.user.id_usuario;

        const productoExistente = await pool.query("SELECT stock FROM producto WHERE id_producto = $1", [id_producto]);
        if (productoExistente.rowCount === 0) {
            return res.status(400).json({ error: "El producto no existe." });
        }

        const stockDisponible = productoExistente.rows[0].stock;
        if (cantidad > stockDisponible || cantidad < 1) {
            return res.status(400).json({ error: "Cantidad no permitida." });
        }

        await pool.query(
            "UPDATE carrito SET cantidad = $1 WHERE id_usuario = $2 AND id_producto = $3",
            [cantidad, id_usuario, id_producto]
        );

        res.json({ success: true, message: "Cantidad actualizada correctamente" });

    } catch (error) {
        console.error("🚨 Error en /api/carrito PUT:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

// ✅ RUTA: Eliminar un producto del carrito
router.delete("/carrito/:id_producto", verificarToken, async (req, res) => {
    try {
        const { id_producto } = req.params;
        const id_usuario = req.user.id_usuario;

        // 🔹 Verificar si el producto existe en el carrito antes de eliminarlo
        const result = await pool.query(
            "DELETE FROM carrito WHERE id_usuario = $1 AND id_producto = $2 RETURNING *",
            [id_usuario, id_producto]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "El producto no está en el carrito o ya fue eliminado" });
        }

        res.json({ success: true, message: "Producto eliminado del carrito correctamente" });
    } catch (error) {
        console.error("🚨 Error en DELETE /api/carrito/:id_producto:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// ✅ RUTA: Vaciar todo el carrito del usuario
router.delete("/carrito", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;

        // 🔹 Verificar si el usuario tiene productos en el carrito antes de eliminar
        const checkCart = await pool.query("SELECT * FROM carrito WHERE id_usuario = $1", [id_usuario]);

        if (checkCart.rowCount === 0) {
            return res.status(404).json({ error: "El carrito ya está vacío." });
        }

        // 🔹 Eliminar todos los productos del carrito del usuario autenticado
        await pool.query("DELETE FROM carrito WHERE id_usuario = $1", [id_usuario]);

        res.json({ success: true, message: "Carrito vaciado correctamente" });
    } catch (error) {
        console.error("🚨 Error en DELETE /api/carrito:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

module.exports = router;
