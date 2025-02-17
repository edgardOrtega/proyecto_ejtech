# Proyecto EDPAK

## 👤 Usuarios de Log In 👤 

Para revisar el login, puede ingresar con los correos y contraseñas de cualquier usuario en `data/listadoUsuarios.json`.

### **Ejemplos:**

**Administrador**  
`Email`: `admin@admin.com`  
`Password`: `admin`  

**Cliente**  
`Email`: `cliente@cliente.com`  
`Password`: `cliente`  


## 📜 Descripción

Este es un proyecto en desarrollo (**solo Frontend**) con **React**, que utiliza varias dependencias para facilitar la construcción de la interfaz de usuario y la gestión de rutas.

### 🛍️ Marketplace de artículos tecnológicos
El proyecto consiste en un **Marketplace** enfocado en la compra de artículos tecnológicos *(hasta el momento, solo cámaras)*.  
Los usuarios deben **iniciar sesión** para acceder a las rutas privadas, dependiendo de su rol:

### 👤 **Roles de usuario**
- **Administrador**: Puede acceder a las **vistas públicas** (`Home`) y a **todas las vistas privadas**, incluyendo:
  - Mi perfil
  - Galería
  - Listar usuarios
  - Listar productos
  - Crear producto
  - Carrito
  - Historial

- **Cliente**: Puede acceder a las **vistas públicas** (`Home`) y solo a las **vistas privadas permitidas**, que son:
  - Mi perfil
  - Galería
  - Carrito
  - Historial

Cada usuario tiene un botón **"Cerrar sesión"** en la **NavBar** para salir de su cuenta (último apartado del presente ReadMe).

✍️ **Este proyecto sigue en desarrollo y se ampliará con más funcionalidades.**  


## ⬇️ Instalación
Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   ```
2. Accede al directorio del proyecto:
   ```bash
   cd nombre-del-proyecto
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## 📦 Dependencias utilizadas

| Paquete               | Versión      | Descripción |
|----------------------|------------|-------------|
| **axios**            | ^1.7.9      | Cliente HTTP para realizar peticiones a APIs |
| **bootstrap**        | ^5.0.2      | Framework de diseño CSS para estilos responsivos |
| **react**            | ^18.3.1     | Librería principal para construir interfaces de usuario |
| **react-bootstrap**  | ^2.9.0-beta.1 | Componentes de Bootstrap para React |
| **react-dom**        | ^18.3.1     | Renderizado de la aplicación en el DOM |
| **react-icons**      | ^5.4.0      | Conjunto de iconos populares para React |
| **react-router-dom** | ^7.1.5      | Manejo de rutas y navegación en React |
| **sweetalert2**    | ^11.16.1    | Para notificaciones y ventanas mas esteticas |

## ⚡ Tecnologías Utilizadas
- **Frontend**: React, React Bootstrap, React Router
- **Backend (Simulado)**: JSON Server para manejo de datos de usuarios y productos
- **Gestor de Estado**: Context API para la gestión del carrito de compras y autenticación
- **Autenticación**: Manejo de usuarios con localStorage
- **Alertas**: SweetAlert2 para notificaciones

## 📂 Estructura del Proyecto
```
Proyecto_EDPAK/
│── public/
│   ├── data/
│   │   ├── listadoUsuarios.json  # Datos de Usuarios
│   │   ├── tecnologia.json  # Datos de Producto
│── src/
│   ├── assets/
│   │   ├── edpak.png
│   │   ├── grupo.png
│   ├── components/
│   │   ├── AdminRoute.jsx
│   │   ├── ClientRoute.jsx
│   │   ├── Navegation.jsx
│   │   ├── ProductCart.jsx
│   │   ├── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── HistoryContext.jsx
│   ├── view/
│   │   ├── Carrito.jsx
│   │   ├── CrearProducto.jsx
│   │   ├── EditarProducto.jsx
│   │   ├── EditarUsuario.jsx
│   │   ├── Error404.jsx
│   │   ├── Galeria.jsx
│   │   ├── Historial.jsx
│   │   ├── Home.jsx
│   │   ├── ListarProductos.jsx
│   │   ├── ListarUsuarios.jsx
│   │   ├── Login.jsx
│   │   ├── Logout.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│── App.css
│── App.jsx
│── index.css
│── main.jsx
│── package.json
│── .gitignore
│── README.md
...
```


## 🎯 Características Principales

### 🔓 **Funcionalidades Públicas**
- Visualización del **Home**.
- Registro de usuarios.
- Inicio de sesión.

### 🔒 **Funcionalidades Protegidas**
#### 👤 **Cliente**
- Acceso al **carrito de compras**.
- Visualización del **Historial de pedidos**.
- Exploración de la **Galería de productos**.

#### 👑 **Administrador**
- **Gestión de productos**: listar, crear y editar productos.
- **Gestión de usuarios**: listar y editar usuarios.

---

## 🔑 **Flujo de Autenticación y Navegación**
1. Un usuario **se registra o inicia sesión**.  
2. Si la autenticación es correcta, se almacena en **Context API**.  
3. Dependiendo del **rol**, se muestran diferentes opciones en la **NavBar**.  
4. Los usuarios pueden **agregar productos al carrito** y realizar compras.  
5. Al **cerrar sesión**, se limpia la variable global en **Context API**, mostrando solo las vistas públicas.

---

## 📝 **Próximas Mejoras**
- 🔗 **Integración con una API real** para usuarios y productos.  
- 🔒 **Encriptación de contraseñas** y autenticación con **JWT**.  
- 🎨 **Mejoras en la interfaz de usuario** para optimizar la experiencia de compra.  
- 🗄️ **Incorporar base de datos real** con **PostgreSQL**.

---

## 🖊️ **Créditos**
Desarrollado con ❤️ y **React** por:  
- **Edgard Ortega Pino**  
- **Joaquín López Rojas**
