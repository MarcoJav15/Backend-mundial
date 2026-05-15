const express = require("express");

const router = express.Router();

const {
  crearGrupo,
  obtenerGrupos,
  obtenerGrupoPorId,
  actualizarGrupo,
  eliminarGrupo
} = require("../controllers/grupos.controller");


// Crear

router.post("/", crearGrupo);


// Obtener todos

router.get("/", obtenerGrupos);


// Obtener por ID

router.get("/:id", obtenerGrupoPorId);


// Actualizar

router.put("/:id", actualizarGrupo);


// Eliminar

router.delete("/:id", eliminarGrupo);


module.exports = router;