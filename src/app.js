const express = require("express");

const cors = require("cors");

const equiposRoutes = require("./routes/equipos.routes");

const sorteosRoutes = require("./routes/sorteos.routes");

const notFoundMiddleware = require("./middlewares/notFound.middleware");

const errorMiddleware = require("./middlewares/error.middleware");


const app = express();


// Middlewares

app.use(cors());

app.use(express.json());


// Ruta raíz

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "API Mundial funcionando correctamente"
  });
});


// Rutas

app.use("/equipos", equiposRoutes);

app.use("/sorteos", sorteosRoutes);


// Ruta no encontrada

app.use(notFoundMiddleware);


// Manejo global de errores

app.use(errorMiddleware);


module.exports = app;