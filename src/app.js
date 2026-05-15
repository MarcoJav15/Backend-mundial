const express = require("express");

const cors = require("cors");

const equiposRoutes =
  require("./routes/equipos.routes");

const gruposRoutes =
  require("./routes/grupos.routes");

const sorteosRoutes =
  require("./routes/sorteos.routes");

const notFoundMiddleware =
  require("./middlewares/notFound.middleware");

const errorMiddleware =
  require("./middlewares/error.middleware");


const app = express();


// =====================================
// MIDDLEWARES
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// RUTA RAÍZ
// =====================================

app.get("/", (req, res) => {

  res.status(200).json({
    ok: true,
    mensaje: "API Mundial funcionando correctamente"
  });

});


// =====================================
// RUTAS
// =====================================

app.use("/equipos", equiposRoutes);

app.use("/grupos", gruposRoutes);

app.use("/sorteos", sorteosRoutes);


// =====================================
// RUTA NO ENCONTRADA
// =====================================

app.use(notFoundMiddleware);


// =====================================
// MANEJO GLOBAL ERRORES
// =====================================

app.use(errorMiddleware);


module.exports = app;