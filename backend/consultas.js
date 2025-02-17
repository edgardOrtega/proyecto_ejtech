const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "12345",
  database: "joyas",
  port: 5432,
  allowExitOnIdle: true,
});

const obtenerJoyas = async ({
  limit = 3,
  page = 2,
  order_by = "stock_ASC",
}) => {
  const [campo, direccion] = order_by.split("_");
  const offset = Math.abs((page - 1) * limit);
  // stock ASC  LIMIT 3
  const formattedQuery = format(
    "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
    campo,
    direccion,
    limit,
    offset
  );
  try {
    // Ejecutar la consulta
    const { rows } = await pool.query(formattedQuery);
    // Estructura HATEOAS para devolver un enlace por cada joya
    return {
      total: rows.length, // Cantidad de joyas devueltas
      results: rows.map((j) => ({
        nombre: j.nombre,
        href: `/joyas/${j.id}`,
      })),
    };
  } catch (error) {
    console.error("Error obteniendo joyas:", error.message);
    throw error;
  }
};

const obtenerJoyasPorFiltros = async ({
  precio_min,
  precio_max,
  categoria,
  metal,
}) => {
  let filtros = [];
  const values = [];
  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${campo} ${comparador} $${length + 1}`);
  };
  if (precio_min) agregarFiltro("precio", ">=", precio_min);
  if (precio_max) agregarFiltro("precio", "<=", precio_max);
  if (categoria) agregarFiltro("categoria", "=", categoria);
  if (metal) agregarFiltro("metal", "=", metal);
  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
  }

  try {
    const { rows:inventario } = await pool.query(consulta, values);
    return inventario;
  } catch (error) {
    console.error("Error obteniendo joyas por filtros:", error.message);
  }
};

module.exports = { obtenerJoyas,obtenerJoyasPorFiltros };
