require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para procesar JSON

// Configuración de PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "tienda_tecnologica",
    password: process.env.DB_PASSWORD || "12345",
    port: process.env.DB_PORT || 5432,
});

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Acceso denegado" });

    jwt.verify(token.split(" ")[1], process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido" });
        req.user = decoded;
        next();
    });
};

// ✅ RUTA: Registrar Usuario
app.post("/api/registro", async (req, res) => {
    try {
        const { username, email, password, fecha_nacimiento, id_rol } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO usuario (username, email, password, fecha_nacimiento, id_rol) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, username, email, id_rol;
        `;
        const values = [username, email, hashedPassword, fecha_nacimiento, id_rol];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("🚨 Error en /api/registro:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ RUTA: Login
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);

        if (user.rowCount === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: "Credenciales incorrectas" });

        const token = jwt.sign(
            { id_usuario: user.rows[0].id_usuario, email: user.rows[0].email, id_rol: user.rows[0].id_rol },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.json({ success: true, token, rol: user.rows[0].id_rol });
    } catch (error) {
        console.error("🚨 Error en /api/login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// ✅ RUTA: Obtener todos los productos
app.get("/api/productos", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM producto ORDER BY id_producto ASC");
        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/productos:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ RUTA: Agregar productos al carrito
app.post("/api/carrito", verificarToken, async (req, res) => {
    try {
        const { id_producto, cantidad } = req.body;
        const id_usuario = req.user.id_usuario;

        const productoExistente = await pool.query("SELECT stock FROM producto WHERE id_producto = $1", [id_producto]);
        if (productoExistente.rowCount === 0) return res.status(400).json({ error: "El producto no existe." });

        const stockDisponible = productoExistente.rows[0].stock;
        if (cantidad > stockDisponible) return res.status(400).json({ error: "Stock insuficiente." });

        const checkCart = await pool.query(
            "SELECT cantidad FROM carrito WHERE id_usuario = $1 AND id_producto = $2",
            [id_usuario, id_producto]
        );

        if (checkCart.rowCount > 0) {
            await pool.query(
                "UPDATE carrito SET cantidad = cantidad + $1 WHERE id_usuario = $2 AND id_producto = $3",
                [cantidad, id_usuario, id_producto]
            );
        } else {
            await pool.query(
                "INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES ($1, $2, $3)",
                [id_usuario, id_producto, cantidad]
            );
        }

        res.json({ success: true, message: "Producto agregado al carrito" });
    } catch (error) {
        console.error("🚨 Error en /api/carrito:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ RUTA: Obtener el carrito del usuario
app.get("/api/carrito", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;
        const { rows } = await pool.query(
            `SELECT c.id_producto, p.nombre, p.precio, c.cantidad, p.imagen 
             FROM carrito c 
             JOIN producto p ON c.id_producto = p.id_producto 
             WHERE c.id_usuario = $1`,
            [id_usuario]
        );
        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/carrito GET:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ RUTA: Obtener historial de órdenes del usuario
app.get("/api/ordenes", verificarToken, async (req, res) => {
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
             GROUP BY o.id_orden`,
            [id_usuario]
        );

        res.json(rows);
    } catch (error) {
        console.error("🚨 Error en /api/ordenes:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/orden", verificarToken, async (req, res) => {
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

        // 🔹 Actualizar stock y verificar que todos los productos tengan stock suficiente
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


        // 🔹 Insertar detalles de la orden en una sola consulta
        const insertDetalleOrdenQuery = `
            INSERT INTO detalle_orden (id_orden, id_producto, cantidad, subtotal)
            SELECT $1, UNNEST($2::int[]), UNNEST($3::int[]), UNNEST($4::numeric[])
        `;

        const subtotales = productos.map(p => p.cantidad * p.precio);
        await client.query(insertDetalleOrdenQuery, [id_orden, ids_productos, cantidades, subtotales]);

        // 🔹 Vaciar el carrito del usuario
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






app.delete("/api/carrito/:id_producto", verificarToken, async (req, res) => {
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
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
