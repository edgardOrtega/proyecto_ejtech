    // 2. Prueba para listar productos
    describe("Listado de productos", () => {
        test("Debe obtener la lista de productos", async () => {
            const response = await request(app).get("/api/listarProductos");
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });