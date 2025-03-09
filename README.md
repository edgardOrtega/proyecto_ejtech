# Proyecto EJtech - Hito 4

## ⚠️⚠️⚠️ ¡ ATENCIÓN ! ⚠️⚠️⚠️  
**El [link deploy del Hito 4](https://frontend-adl.onrender.com/) se encuentra en el apartado "About".**


email para revision: tutor@tutor.com
contraseña tutor   : 12345

## Objetivos logrados con Render
<ul>
    <li>Despliegue de Database. ✅</li>
    <li>Despliegue del Back End. ✅</li>
    <li>Despliegue de Front End. ✅</li>
</ul>

---
---
## Lo siguiente corresponde solo al Hito 3 - Ignorar en revisión de Hito 4:
---
---

## 📌 Descripción
**EJtech** es un **Marketplace** de artículos tecnológicos que permite la compra y gestión de productos mediante una plataforma web. La aplicación tiene autenticación de usuarios con diferentes roles (*Cliente y Administrador*) para gestionar productos y compras.

## 📌 Instrucciones para el usuario

1. **Descargar el archivo** presionando en el botón verde que indica **"Code"**, y luego en **"Download ZIP"**.
2. **Descomprimir** `proyecto_ejtech-main.zip` en un directorio deseado.
3. **Abrir la carpeta** `proyecto_ejtech-main.zip` en **Visual Studio Code**.
4. **Abrir 2 terminales** e ir ejecutando, mediante la tecla **Enter**, los siguientes comandos:

### 🖥️ Terminal I
```bash
cd backend
npm install
nodemon index.js
```

### 🖥️ Terminal II
```bash
cd frontend
npm i
npm run dev
```

⚠️ **Se mostrará un link localhost, aún no lo abras.** ⚠️
⬇️ **Sigue prestando atención al instructivo** ⬇️


## 🗄️ Configuración de la Base de Datos (PostgreSQL)

Para configurar la base de datos en **PostgreSQL**, sigue estos pasos:

### 1. **Abrir PGAdmin o la Terminal de PostgreSQL**
Asegúrate de que **PostgreSQL** esté instalado en tu sistema.

Si usas **PGAdmin**, abre el **Query Tool**.

Si usas la **terminal**, conéctate a PostgreSQL:
```bash
psql -U tu_usuario
```
### 2. **BASE DE DATOS**
Crear y conectarse
```code
-- Crear Base de Datos: tienda_tecnologica
CREATE DATABASE tienda_tecnologica;

-- Conectarse a la base de datos
\c tienda_tecnologica;
```

Ejecutar el siguiente script:
```code
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

-- Insertar productos de ejemplo
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
```

### 3. **Configurar variables de entorno**

Modifica el archivo .env en la carpeta backend con la siguiente configuración:

```code
PORT=3000
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_NAME=tienda_tecnologica
JWT_SECRET=secreto_super_seguro
```

✅ Ahora sí puedes abrir el link localhost de la terminal frontend mediante ctrl+click en el hipervínculo. ✅
📌 **¡Listo! Ahora puedes navegar por la aplicación sin problemas!** 🚀

---

## 🗺️ **Guía de Navegación en la Aplicación**  

A continuación, se detalla cómo navegar dentro del **Marketplace de EJtech**, según el rol del usuario.

## 🌍 **1. Página de Inicio (Home)**
📌 **Ruta:** `/`  

- Al ingresar al sitio, se muestra una página inicial con información del marketplace.  
- Desde aquí, puedes navegar a otras secciones a través de la **barra de navegación superior**.

### 🚀 **Opciones disponibles:**
- **Usuarios no autenticados:**  
  - ✅ Registrarse  
  - ✅ Iniciar sesión  
  - ✅ Ver productos en la galería (sin comprar)  

- **Usuarios autenticados (Clientes y Administradores):**  
  - ✅ Acceso al perfil  
  - ✅ Explorar la galería  
  - ✅ Acceder al carrito y realizar compras  
  - ✅ Historial de pedidos  
  - ✅ (Admin) Gestionar productos y usuarios  

---

## 📝 **2. Registro de Usuario**
📌 **Ruta:** `/Register`  

🔹 Para registrarse, el usuario debe ingresar:  
- ✔️ Nombre de usuario  
- ✔️ Correo electrónico  
- ✔️ Contraseña  
- ✔️ Fecha de nacimiento
- ✔️ Rol
- Luego del registro, puede iniciar sesión para acceder a más funciones.

---

## 🔑 **3. Iniciar Sesión**
📌 **Ruta:** `/Login`  

🔹 Aquí el usuario ingresa su **correo y contraseña** para acceder a su cuenta.  

- ✔️ Si los datos son correctos, se redirige automáticamente a **su perfil**.  
- ❌ Si los datos son incorrectos, se muestra una alerta.  

---

## 🔒 **4. Navegación según Rol**  

Una vez autenticado, el usuario podrá acceder a diferentes rutas dependiendo de su **rol**.  

### **🔹 Cliente**
📌 Puede acceder a:  
- ✅ **Perfil** (`/Profile`)  
- ✅ **Galería de productos** (`/Galeria`)  
- ✅ **Carrito de compras** (`/Carrito`)  
- ✅ **Historial de compras** (`/Historial`)  

### **🔹 Administrador**
📌 Puede acceder a **todo lo anterior**, más:  
- ✅ **Listar Usuarios** (`/ListarUsuarios`)  
- ✅ **Listar Productos** (`/ListarProductos`)  
- ✅ **Crear Producto** (`/CrearProducto`)  
- ✅ **Editar Usuarios** (`/EditarUsuario/:id_usuario`)  
- ✅ **Editar Productos** (`/EditarProducto/:id`)  

---

## 🛍️ **5. Galería de Productos**
📌 **Ruta:** `/Galeria`  

- ✔️ Aquí se pueden ver todos los productos disponibles en la tienda.  
- ✔️ Cada producto tiene un botón **"Ver más"** para ver sus detalles.  
- ✔️ Se puede **agregar productos al carrito** con su cantidad correspondiente.  
- ✔️ El stock disponible se actualiza en tiempo real según las compras.  

📌 **Nota:**  
- Si no hay stock, el botón de compra estará deshabilitado.  
- Si el usuario no ha iniciado sesión, no podrá añadir productos al carrito.

---

## 🛒 **6. Carrito de Compras**
📌 **Ruta:** `/Carrito`  

- ✔️ Aquí el usuario ve **los productos añadidos** al carrito.  
- ✔️ Puede **modificar la cantidad** o **eliminar productos** antes de comprar.  
- ✔️ Una vez listo, puede presionar **"Finalizar Compra"** para confirmar el pedido.  

📌 **Nota:**  
- Al confirmar, se descuenta el stock y se genera una orden en el historial.  
- El ícono del carrito en la barra de navegación muestra la cantidad de productos únicos en el carrito.

---

## 📜 **7. Historial de Compras**
📌 **Ruta:** `/Historial`  

- ✔️ Aquí los clientes pueden ver **todas sus compras anteriores**.  
- ✔️ Se muestra la fecha de compra, el total pagado y los productos adquiridos.  

📌 **Nota:**  
- Un **administrador** puede ver **el historial de todos los clientes**.  
- Un **cliente** solo puede ver su propio historial.

---

## 🛠️ **8. Gestión de Productos (Solo Administrador)**
📌 **Ruta:** `/ListarProductos`  

- ✔️ El administrador puede **ver, editar o eliminar productos existentes**.  
- ✔️ Puede **crear un nuevo producto** en `/CrearProducto`.  

📌 **Edición de Productos:**  
- Se pueden modificar los detalles de un producto (nombre, descripción, precio, stock, imagen).  
- La descripción tiene un área de desplazamiento para facilitar la visualización.  

📌 **Eliminar Producto:**  
- Se puede eliminar un producto, pero solo si no ha sido comprado previamente.  

---

## 👥 **9. Gestión de Usuarios (Solo Administrador)**
📌 **Ruta:** `/ListarUsuarios`  

- ✔️ El administrador puede **ver, editar o eliminar usuarios registrados**.  
- ✔️ Puede cambiar el **rol** de un usuario (`Cliente ↔ Administrador`).  
- ✔️ Puede **desactivar cuentas**, evitando que el usuario inicie sesión.  

---

## 🚪 **10. Cerrar Sesión**
📌 **Ubicación:** Botón en la barra de navegación  

- ✔️ Si el usuario presiona **"Cerrar Sesión"**, su sesión se cierra inmediatamente.  
- ✔️ Se eliminan sus datos del almacenamiento local y se redirige al **Home**.  
- ✔️ La barra de navegación se actualiza, eliminando las opciones restringidas.  

---

## 🛠️ Tecnologías Utilizadas

### 🔹 **Backend**
- **Node.js** → Entorno de ejecución para el backend.
- **Express.js** → Framework para gestionar rutas y middleware.
- **PostgreSQL** → Base de datos relacional.
- **JWT (Json Web Token)** → Autenticación segura con tokens.
- **bcryptjs** → Encriptación de contraseñas.
- **CORS** → Permite la comunicación entre frontend y backend.
- **dotenv** → Manejo de variables de entorno.
- **jest** → Framework para realizar pruebas en el backend.
- **nodemon** → Recarga automática del servidor en desarrollo.
- **supertest** → Pruebas HTTP para APIs.

### 🔹 **Frontend**
- **React.js** → Librería para interfaces dinámicas.
- **React Router** → Manejo de rutas y navegación.
- **Bootstrap & React-Bootstrap** → Estilización y componentes responsivos.
- **Axios** → Peticiones HTTP al backend.
- **SweetAlert2** → Alertas interactivas.
- **React Icons** → Conjunto de iconos SVG para React.
- **Vite** → Entorno de desarrollo rápido para React.
- **ESLint** → Herramienta para mantener el código limpio y libre de errores.

---

## 📂 **Estructura del Proyecto**
```plaintext
proyecto_ejtech/
│── backend/
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── logger.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── editarProducto.js
│   │   ├── editarUsuario.js
│   │   ├── eliminarUsuario.js
│   │   ├── listarProductos.js
│   │   ├── listarUsuarios.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js  
│   ├── test/
│   │   ├── test1.spec.js
│   │   ├── test2.spec.js
│   │   ├── test3.spec.js
│   │   ├── test4.spec.js
│   ├── .env
│   ├── .gitignore
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── script.sql
│
│── frontend/
│   ├── public/
│   │   ├── data/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── ClientRoute.jsx
│   │   │   ├── GuestRoute.jsx
│   │   │   ├── Navegation.jsx
│   │   │   ├── ProductCart.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── HistoryContext.jsx
│   │   ├── view/
│   │   │   ├── Carrito.jsx
│   │   │   ├── CrearProducto.jsx
│   │   │   ├── DetalleProducto.jsx
│   │   │   ├── EditarProducto.jsx
│   │   │   ├── EditarUsuario.jsx
│   │   │   ├── Error404.jsx
│   │   │   ├── Galeria.jsx
│   │   │   ├── Historial.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── ListarProductos.jsx
│   │   │   ├── ListarUsuarios.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   ├── .eslintrc.cjs
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│
│── README.md (este archivo)
```
---
## Créditos
Realizado por Edgard Ortega y Joaquín López para el bootcamp de Desarrollo Web FullStack Javascript G68 de Desafío Latam.
