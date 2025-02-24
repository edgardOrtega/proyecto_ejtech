// al registrar un usuario

const request = require("supertest");
const app = require("../index"); 
const pool = require("../db");

describe("API Routes", () => {
  // Prueba para registrar un usuario
  test("Debe registrar un usuario y devolver su información", async () => {
    const response = await request(app).post("/api/registro").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      fecha_nacimiento: "2000-01-01",
      id_rol: 1,
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id_usuario");
    expect(response.body).toHaveProperty("email", "test@example.com");
  });
});
