import React, { useState, useEffect } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";

const CrearProducto = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });


  const [categories, setCategories] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL; // Para Vite
  useEffect(() => {
    fetch(`${apiUrl}/api/categorias`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar las categorías", "error"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      // ✅ Permitir solo números y formatear con puntos como separadores de miles
      const cleanValue = value.replace(/\D/g, ""); 
      const formattedValue = cleanValue ? `$${parseInt(cleanValue).toLocaleString("es-CL")}` : "";
      setProduct({ ...product, price: formattedValue });
    } else if (name === "stock") {
      // ✅ Permitir solo números en stock
      const cleanValue = value.replace(/\D/g, "");
      setProduct({ ...product, stock: cleanValue });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalPrice = Number(product.price.replace(/[$.]/g, "")); // 🔹 Convertir el precio a número válido

      const response = await fetch(`${apiUrl}/api/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, price: finalPrice }),
      });

      if (response.ok) {
        Swal.fire("¡Éxito!", "Producto agregado correctamente", "success");
        setProduct({ name: "", description: "", price: "", stock: "", category: "", image: "" });
      } else {
        throw new Error("Error al agregar el producto");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar el producto", "error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "350px", backgroundColor: "#FFFF00", padding: "20px", borderRadius: "15px" }}>
        <Card.Body>
          <Card.Title className="text-center fw-bold">AGREGAR PRODUCTO</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre producto</Form.Label>
              <Form.Control type="text" name="name" value={product.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={product.description}
                onChange={handleChange}
                required
                style={{ resize: "none" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="text"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
                inputMode="numeric"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="category" value={product.category} onChange={handleChange} required>
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id_categoria} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control type="text" name="image" value={product.image} onChange={handleChange} required />
            </Form.Group>

            <Button type="submit" variant="dark" className="w-100">
              AGREGAR
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CrearProducto;
