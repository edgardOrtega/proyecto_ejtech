const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
    user: "tu_usuario",
    host: "localhost",
    database: "tienda_tecnologica",
    password: "1234",
    port: 5432,
});

const registrarUsuario = async ({ username, email, password, fecha_nacimiento, id_rol }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
        INSERT INTO usuario (username, email, password, fecha_nacimiento, id_rol) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id_usuario, username, email, fecha_nacimiento, id_rol, activo, creado_en, actualizado_en;
    `;
    const values = [username, email, hashedPassword, fecha_nacimiento, id_rol];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Función para verificar credenciales
const verificarUsuario = async (email) => {
    const query = "SELECT * FROM usuario WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0]; // Devuelve el usuario encontrado o undefined
};


module.exports = { registrarUsuario, verificarUsuario };