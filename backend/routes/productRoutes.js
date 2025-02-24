const express = require("express");
const pool = require("../db");

const router = express.Router();

// 🔹 Obtener todos los productos
router.get("/productos", async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT p.*, c.nombre AS categoria 
             FROM producto p 
             JOIN categoria c ON p.id_categoria = c.id_categoria 
             ORDER BY p.id_producto ASC`
        );
        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/productos:", error);
        res.status(500).json({ error: "Error al obtener los productos." });
    }
});

// 🔹 Obtener un solo producto por ID
router.get("/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Buscando producto con ID: ${id}`);

        const { rows } = await pool.query(
            `SELECT p.*, c.nombre AS categoria 
             FROM producto p 
             JOIN categoria c ON p.id_categoria = c.id_categoria 
             WHERE p.id_producto = $1`,
            [id]
        );

        if (rows.length === 0) {
            console.log("⚠️ Producto no encontrado");
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        console.log("✅ Producto encontrado:", rows[0]);
        res.json(rows[0]);
    } catch (error) {
        console.error("🚨 Error en /api/productos/:id:", error);
        res.status(500).json({ error: "Error al obtener el producto." });
    }
});

// 🔹 Crear un nuevo producto
router.post("/productos", async (req, res) => {
    try {
        const { name, description, price, stock, category, image } = req.body;

        // 🔹 Validar que los campos obligatorios estén llenos
        if (!name || !description || !price || !stock || !category || !image) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        // 🔹 Buscar el id_categoria según el nombre de la categoría
        const categoriaQuery = await pool.query(
            "SELECT id_categoria FROM categoria WHERE nombre = $1",
            [category]
        );

        if (categoriaQuery.rowCount === 0) {
            return res.status(400).json({ error: "La categoría especificada no existe." });
        }

        const id_categoria = categoriaQuery.rows[0].id_categoria;

        // 🔹 Insertar el producto en la base de datos
        const result = await pool.query(
            `INSERT INTO producto (nombre, descripcion, precio, stock, id_categoria, imagen) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, description, price, stock, id_categoria, image]
        );

        res.status(201).json({ success: true, message: "Producto agregado correctamente", producto: result.rows[0] });

    } catch (error) {
        console.error("🚨 Error en /api/productos:", error);
        res.status(500).json({ error: "Error al agregar el producto." });
    }
});

module.exports = router;
