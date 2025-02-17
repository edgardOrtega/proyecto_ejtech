const express = require("express");
const cors = require("cors");
const { obtenerJoyas, obtenerJoyasPorFiltros } = require("./consultas");
const { loggerMiddleware } = require("./middleware/logger");
const app = express();
app.listen(3000, console.log("Server ON"));

app.use(loggerMiddleware)
app.get("/joyas", async (req, res) => {
  try {
    const joyas = await obtenerJoyas(req.query); 
    res.status(200).json(joyas); 
  } catch (error) {
    console.error("Error en la ruta /joyas:", error.message);
    res.status(500).json({ error: "Error obteniendo las joyas" }); 
  }
});

app.get("/joyas/filtros", async (req, res) => {
    try {
      const queryStrings = req.query; 
      const joyas = await obtenerJoyasPorFiltros(queryStrings);
      res.status(200).json(joyas); 
    } catch (error) {
      console.error("Error en la ruta /joyas/filtros:", error.message);
      res.status(500).json({ error: "Error obteniendo las joyas con filtros" }); 
    }
  });