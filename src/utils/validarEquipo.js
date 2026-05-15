const validarEquipo = ({
  codigo_fifa,
  ranking_fifa,
  jugadores_inscritos
}) => {

  // Código FIFA

  if (codigo_fifa.length !== 3) {
    return {
      ok: false,
      mensaje: "El código FIFA debe tener 3 letras"
    };
  }

  // Ranking numérico

  if (isNaN(ranking_fifa)) {
    return {
      ok: false,
      mensaje: "El ranking debe ser numérico"
    };
  }

  // Jugadores

  if (
    jugadores_inscritos < 23 ||
    jugadores_inscritos > 26
  ) {
    return {
      ok: false,
      mensaje:
        "Los jugadores deben ser entre 23 y 26"
    };
  }

  // Todo correcto

  return {
    ok: true
  };
};

module.exports = validarEquipo;