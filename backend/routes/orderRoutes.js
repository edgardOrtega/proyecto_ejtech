const express = require("express");
const pool = require("../db");
const verificarToken = require("../authMiddleware");

const router = express.Router();

/**
 * 🔹 Obtener historial de órdenes del usuario autenticado
 */
router.get("/ordenes", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;
        const { rows } = await pool.query(
            `SELECT o.id_orden, o.fecha, o.total, o.estado, 
                json_agg(json_build_object(
                    'id_producto', d.id_producto, 
                    'nombre', p.nombre, 
                    'imagen', p.imagen, 
                    'cantidad', d.cantidad, 
                    'subtotal', d.subtotal
                )) AS productos
             FROM orden o
             JOIN detalle_orden d ON o.id_orden = d.id_orden
             JOIN producto p ON d.id_producto = p.id_producto
             WHERE o.id_usuario = $1
             GROUP BY o.id_orden
             ORDER BY o.fecha DESC`,
            [id_usuario]
        );

        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/ordenes:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * 🔹 Crear una nueva orden de compra
 */
router.post("/orden", verificarToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // 🔹 Iniciar transacción

        const id_usuario = req.user.id_usuario;
        const { total, productos } = req.body;

        // 🔹 Insertar la orden en la base de datos y obtener su ID
        const { rows } = await client.query(
            "INSERT INTO orden (id_usuario, total) VALUES ($1, $2) RETURNING id_orden",
            [id_usuario, total]
        );
        const id_orden = rows[0].id_orden;

        // 🔹 Verificar stock y actualizarlo antes de confirmar la compra
        const ids_productos = productos.map(p => p.id_producto);
        const cantidades = productos.map(p => p.cantidad);

        const updateStockQuery = `
            UPDATE producto 
            SET stock = stock - c.cantidad
            FROM (SELECT UNNEST($1::int[]) AS id_producto, UNNEST($2::int[]) AS cantidad) AS c
            WHERE producto.id_producto = c.id_producto
            AND producto.stock >= c.cantidad
            RETURNING producto.id_producto, producto.stock;
        `;

        const stockResult = await client.query(updateStockQuery, [ids_productos, cantidades]);

        if (stockResult.rows.length !== productos.length) {
            throw new Error("Stock insuficiente o error en la actualización de stock.");
        }

        // 🔹 Insertar detalles de la orden
        const insertDetalleOrdenQuery = `
            INSERT INTO detalle_orden (id_orden, id_producto, cantidad, subtotal)
            SELECT $1, UNNEST($2::int[]), UNNEST($3::int[]), UNNEST($4::numeric[])
        `;

        const subtotales = productos.map(p => p.cantidad * p.precio);
        await client.query(insertDetalleOrdenQuery, [id_orden, ids_productos, cantidades, subtotales]);

        // 🔹 Vaciar el carrito después de la compra
        await client.query("DELETE FROM carrito WHERE id_usuario = $1", [id_usuario]);

        await client.query("COMMIT"); // 🔹 Confirmar la transacción

        res.json({ success: true, message: "Orden creada con éxito", id_orden });

    } catch (error) {
        await client.query("ROLLBACK"); // 🔹 Revertir cambios si hay un error
        console.error("🚨 Error en /api/orden:", error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release(); // 🔹 Liberar la conexión
    }
});

module.exports = router;
