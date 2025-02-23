    // 3. Prueba para eliminar un producto
    describe("Eliminación de producto", () => {
        test("Debe eliminar un producto existente", async () => {
            // Inserta un producto de prueba
            const producto = await pool.query(
                "INSERT INTO producto (nombre, descripcion, precio, stock, id_categoria, imagen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                ["Producto Test", "Descripción Test", 100, 10, 1, "imagen.jpg"]
            );
            const productoId = producto.rows[0].id_producto;

            // Elimina el producto
            const response = await request(app).delete(`/api/listarProductos/${productoId}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Producto eliminado correctamente");
        });
    });