const express = require("express");

const router = express.Router();

const {
  generarSorteo,
  obtenerSorteos,
  obtenerSorteoPorId
} = require("../controllers/sorteos.controller");


// Generar sorteo

router.post("/generar", generarSorteo);


// Obtener todos los sorteos

router.get("/", obtenerSorteos);


// Obtener sorteo por ID

router.get("/:id", obtenerSorteoPorId);


module.exports = router;