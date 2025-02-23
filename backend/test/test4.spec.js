const request = require("supertest");
const app = require("../index"); // Asegúrate de que tu index.js exporte 'app'
const pool = require("../db");
// 4. Prueba para obtener productos con categorías
describe("Listado de productos con categorías", () => {
  test("Debe obtener los productos con categorías", async () => {
    const response = await request(app).get("/api/productos");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});

afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
});
