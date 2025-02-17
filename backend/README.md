# proyecto_ejtech


## 📦 Dependencias utilizadas

| Paquete            | Versión    | Descripción |
|--------------------|------------|-------------|
| **cors**           | ^2.8.5     | Middleware de Express para habilitar CORS (Cross-Origin Resource Sharing).Permite que tu backend sea accesible desde otros dominios.|
| **express**        | ^4.21.2    | Framework de Node.js para construir servidores y manejar rutas. Permite definir endpoints (app.get(), app.post(), etc.). |
| **pg**             | ^8.13.3    | Cliente de PostgreSQL para Node.js. Se usa para conectarse y ejecutar consultas en una base de datos PostgreSQL.|
|**jsonwebtoken**    | ^9.0.2     | Librería para generar y verificar JSON Web Tokens (JWT). Se usa para autenticación y autorización en aplicaciones web y APIs.|

## ⚡ Tecnologías Utilizadas
- Node.js es un entorno de ejecución para JavaScript en el lado del servidor. Permite crear aplicaciones web rápidas y escalables con un solo lenguaje (JavaScript).
- Express.js es un framework minimalista para Node.js que facilita la creación de servidores web y APIs REST.
- PostgreSQL es un sistema de gestión de bases de datos relacional. La dependencia pg permite interactuar con PostgreSQL desde Node.js.
- JWT es un estándar para generar tokens seguros que autentican usuarios sin necesidad de almacenar sesiones en el servidor.
- CORS (Cross-Origin Resource Sharing) permite que tu API sea accesible desde otros dominios distintos al servidor backend.

## 📌Flujo general de la aplicación
- El usuario se registra o inicia sesión.
- Si inicia sesión correctamente, el backend genera un JWT.
- El usuario usa el token para acceder a rutas protegidas (ej. ver perfil, agregar productos).
- El backend maneja datos con PostgreSQL.
- El middleware cors permite que el frontend pueda comunicarse con la API sin problemas.

## 📂 Estructura del Proyecto
```
Proyecto_EDPAK/backend
│── middlewares/
│   │  
│   │  
│   │ 
│── test/
│   |── test1.spect.js
│   ├── test2.spect.js
│   ├── test3.spect.js
│   ├── test4.spect.js
│── .gitignore
├── consultas.js
├── index.js
├── package-lock.json
├── package.json
│── README.md
│── script.sql
...
```