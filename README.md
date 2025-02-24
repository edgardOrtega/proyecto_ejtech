# Proyecto EDPAK

## 📌 Descripción
**EJtech** es un **Marketplace** de artículos tecnológicos que permite la compra y gestión de productos mediante una plataforma web. La aplicación tiene autenticación de usuarios con diferentes roles (*Cliente y Administrador*) para gestionar productos y compras.

## 🛠️ Tecnologías Utilizadas

### 🔹 **Backend**
- **Node.js** → Entorno de ejecución para el backend.
- **Express.js** → Framework para gestionar rutas y middleware.
- **PostgreSQL** → Base de datos relacional.
- **JWT (Json Web Token)** → Autenticación segura con tokens.
- **bcryptjs** → Encriptación de contraseñas.
- **CORS** → Permite la comunicación entre frontend y backend.

### 🔹 **Frontend**
- **React.js** → Librería para interfaces dinámicas.
- **React Router** → Manejo de rutas y navegación.
- **Bootstrap & React-Bootstrap** → Estilización y componentes responsivos.
- **Axios** → Peticiones HTTP al backend.
- **SweetAlert2** → Alertas interactivas.

---

## 📂 **Estructura del Proyecto**
```plaintext
proyecto_ejtech/
│── backend/
│   ├── middlewares/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js  
│   ├── test/
│   ├── .env
│   ├── .gitignore
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   ├── README.md
│   ├── script.sql
│
│── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── view/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   ├── package.json
│   ├── README.md
│   ├── .gitignore
│
│── README.md (este archivo)
