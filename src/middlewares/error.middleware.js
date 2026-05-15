const errorMiddleware = (err, req, res, next) => {

  console.log(err);

  res.status(500).json({
    ok: false,
    mensaje: "Error interno del servidor"
  });

};

module.exports = errorMiddleware;