-- Crear Base de Datos: tienda_tecnologica
CREATE DATABASE tienda_tecnologica;

-- Crear Tabla: rol
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Crear Tabla: usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    id_rol INT NOT NULL REFERENCES rol(id_rol),
    activo BOOLEAN DEFAULT TRUE NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insertar 2 roles
INSERT INTO rol (nombre) VALUES ('Administrador'), ('Cliente');

-- Insertar 4 usuarios 2 de administrador y 2 de cliente
INSERT INTO usuario (username, email, password, fecha_nacimiento, id_rol) VALUES 
('admin1', 'admin1@example.com', 'hashed_password_1', '1990-05-10', 1),
('admin2', 'admin2@example.com', 'hashed_password_2', '1985-08-15', 1),
('cliente1', 'cliente1@example.com', 'hashed_password_3', '2000-03-22', 2),
('cliente2', 'cliente2@example.com', 'hashed_password_4', '1998-11-30', 2);

-- Crear Tabla: categoria
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Insertar 4 categorias
INSERT INTO categoria (nombre) VALUES ('Laptops'), ('Smartphones'), ('Accesorios'), ('Audio');

-- Crear Tabla: producto
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio BIGINT NOT NULL,
    stock INT DEFAULT 0 NOT NULL,
    imagen TEXT NOT NULL, 
    id_categoria INT NOT NULL REFERENCES categoria(id_categoria),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Instertar 4 productos
INSERT INTO producto (nombre, descripcion, precio, stock, imagen, id_categoria) VALUES 
('MacBook Pro', 'Laptop Apple M2 Pro de 16 pulgadas', 249999, 10, 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/17336919_1/w=800,h=800,fit=pad', 1),
('Samsung Galaxy S23', 'Smartphone Samsung con pantalla Dynamic AMOLED', 99999, 15, 'https://iprotech.cl/wp-content/uploads/2023/02/s23-ultra-negro.jpg.webp', 2),
('Teclado Mecánico RGB', 'Teclado mecánico para gaming con iluminación RGB', 12999, 30, 'https://www.chilegatillos.cl/cdn/shop/files/TecladoRK61ChilegatillosBLACK.jpg?v=1717039769&width=2048', 3),
('Auriculares Bose 700', 'Auriculares inalámbricos con cancelación de ruido', 37999, 20, 'https://http2.mlstatic.com/D_NQ_NP_805075-MLA74214143118_012024-O.webp', 4);

-- Crear Tabla: carrito
CREATE TABLE carrito (
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    id_producto INT NOT NULL REFERENCES producto(id_producto),
    cantidad INT DEFAULT 1 NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id_usuario, id_producto)
);

-- Crear Tabla: orden
CREATE TABLE orden (
    id_orden SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total BIGINT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Crear Tabla: detalle_orden
CREATE TABLE detalle_orden (
    id_detalle SERIAL PRIMARY KEY,
    id_orden INT NOT NULL REFERENCES orden(id_orden),
    id_producto INT NOT NULL REFERENCES producto(id_producto),
    cantidad INT NOT NULL,
    subtotal BIGINT NOT NULL
);