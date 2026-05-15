const express = require("express");

const router = express.Router();

const {
  previewSorteo,
  generarSorteo,
  obtenerSorteos,
  obtenerSorteoPorId
} = require("../controllers/sorteos.controller");

// Preview sorteo

router.post("/preview", previewSorteo);

// Generar sorteo

router.post("/generar", generarSorteo);


// Obtener todos los sorteos

router.get("/", obtenerSorteos);


// Obtener sorteo por ID

router.get("/:id", obtenerSorteoPorId);


module.exports = router;