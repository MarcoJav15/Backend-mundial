const express = require("express");

const router = express.Router();

const {
  crearEquipo,
  obtenerEquipos,
  obtenerEquipoPorId,
  actualizarEquipo,
  eliminarEquipo
} = require("../controllers/equipos.controller");


// Crear equipo

router.post("/", crearEquipo);


// Obtener todos

router.get("/", obtenerEquipos);


// Obtener por ID

router.get("/:id", obtenerEquipoPorId);


// Actualizar

router.put("/:id", actualizarEquipo);


// Eliminar

router.delete("/:id", eliminarEquipo);


module.exports = router;