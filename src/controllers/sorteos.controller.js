const pool = require("../db/connection");


// =========================================
// GENERAR SORTEO
// =========================================

const generarSorteo = async (req, res, next) => {
  try {

    // Obtener equipos

    const equiposDB = await pool.query(
      `
      SELECT * FROM equipos
      `
    );

    // Obtener grupos

    const gruposDB = await pool.query(
      `
      SELECT * FROM grupos
      ORDER BY id ASC
      `
    );

    const equipos = equiposDB.rows;

    const grupos = gruposDB.rows;

    // Validaciones

    if (equipos.length === 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "No hay equipos registrados"
      });
    }

    if (grupos.length === 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "No hay grupos registrados"
      });
    }

    // Validar divisibilidad

    if (equipos.length % grupos.length !== 0) {
      return res.status(400).json({
        ok: false,
        mensaje:
          "La cantidad de equipos no puede dividirse exactamente entre grupos"
      });
    }

    // Mezclar aleatoriamente

    const equiposMezclados = [...equipos].sort(
      () => Math.random() - 0.5
    );

    // Crear nueva distribución

    const nuevaDistribucion = await pool.query(
      `
      INSERT INTO distribuciones (fecha)
      VALUES (CURRENT_TIMESTAMP)
      RETURNING *
      `
    );

    const distribucionId =
      nuevaDistribucion.rows[0].id;

    // Cantidad por grupo

    const equiposPorGrupo =
      equipos.length / grupos.length;

    let indexEquipo = 0;

    const resultado = [];

    // Repartir equipos

    for (const grupo of grupos) {

      const grupoActual = {
        grupo: grupo.nombre,
        equipos: []
      };

      for (let i = 0; i < equiposPorGrupo; i++) {

        const equipo =
          equiposMezclados[indexEquipo];

        // Guardar relación

        await pool.query(
          `
          INSERT INTO distribucion_equipos
          (
            distribucion_id,
            grupo_id,
            equipo_id
          )
          VALUES ($1, $2, $3)
          `,
          [
            distribucionId,
            grupo.id,
            equipo.id
          ]
        );

        grupoActual.equipos.push(
          equipo.nombre_pais
        );

        indexEquipo++;
      }

      resultado.push(grupoActual);
    }

    res.status(200).json({
      ok: true,
      mensaje: "Sorteo generado correctamente",
      data: {
        distribucion_id: distribucionId,
        grupos: resultado
      }
    });

  } catch (error) {

    next(error);

  }
};


// =========================================
// OBTENER TODOS LOS SORTEOS
// =========================================

const obtenerSorteos = async (req, res, next) => {
  try {

    const resultado = await pool.query(
      `
      SELECT
        d.id AS distribucion_id,
        d.fecha,
        g.nombre AS grupo,
        e.nombre_pais AS equipo
      FROM distribucion_equipos de

      INNER JOIN distribuciones d
        ON de.distribucion_id = d.id

      INNER JOIN grupos g
        ON de.grupo_id = g.id

      INNER JOIN equipos e
        ON de.equipo_id = e.id

      ORDER BY d.id, g.nombre
      `
    );

    res.status(200).json({
      ok: true,
      mensaje: "Sorteos obtenidos",
      data: resultado.rows
    });

  } catch (error) {

    next(error);

  }
};


// =========================================
// OBTENER SORTEO POR ID
// =========================================

const obtenerSorteoPorId = async (req, res, next) => {
  try {

    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT
        d.id AS distribucion_id,
        d.fecha,
        g.nombre AS grupo,
        e.nombre_pais AS equipo
      FROM distribucion_equipos de

      INNER JOIN distribuciones d
        ON de.distribucion_id = d.id

      INNER JOIN grupos g
        ON de.grupo_id = g.id

      INNER JOIN equipos e
        ON de.equipo_id = e.id

      WHERE d.id = $1

      ORDER BY g.nombre
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Sorteo no encontrado"
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: "Sorteo obtenido",
      data: resultado.rows
    });

  } catch (error) {

    next(error);

  }
};


module.exports = {
  generarSorteo,
  obtenerSorteos,
  obtenerSorteoPorId
};