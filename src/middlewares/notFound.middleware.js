const notFoundMiddleware = (req, res) => {

  res.status(404).json({
    ok: false,
    mensaje: "Ruta no encontrada"
  });

};

module.exports = notFoundMiddleware;