const pool = require("../db/connection");


// =========================================
// GENERAR SORTEO
// =========================================
// =========================================
// PREVIEW SORTEO
// =========================================

const previewSorteo = async (req, res, next) => {

  try {

    const { cantidadGrupos } = req.body;


    // =====================================
    // VALIDAR CANTIDAD
    // =====================================

    if (!cantidadGrupos || cantidadGrupos <= 1) {

      return res.status(400).json({
        ok: false,
        mensaje:
          "La cantidad de grupos debe ser mayor a 1"
      });

    }


    // =====================================
    // EQUIPOS
    // =====================================

    const equiposDB = await pool.query(
      `
      SELECT * FROM equipos
      `
    );


    // =====================================
    // GRUPOS
    // =====================================

    const gruposDB = await pool.query(
      `
      SELECT * FROM grupos
      ORDER BY id ASC
      LIMIT $1
      `,
      [cantidadGrupos]
    );


    const equipos = equiposDB.rows;

    const grupos = gruposDB.rows;


    // =====================================
    // VALIDACIONES
    // =====================================

    if (equipos.length === 0) {

      return res.status(400).json({
        ok: false,
        mensaje: "No hay equipos registrados"
      });

    }


    if (grupos.length < cantidadGrupos) {

      return res.status(400).json({
        ok: false,
        mensaje:
          "No existen suficientes grupos registrados"
      });

    }


    if (equipos.length % grupos.length !== 0) {

      return res.status(400).json({
        ok: false,
        mensaje:
          "La cantidad de equipos no puede dividirse exactamente entre grupos"
      });

    }


    // =====================================
    // MEZCLAR
    // =====================================

    const equiposMezclados = [...equipos].sort(
      () => Math.random() - 0.5
    );


    // =====================================
    // ARMAR PREVIEW
    // =====================================

    const equiposPorGrupo =
      equipos.length / grupos.length;


    let indexEquipo = 0;

    const resultado = [];


    for (const grupo of grupos) {

      const grupoActual = {

        grupo: grupo.nombre,

        equipos: []

      };


      for (let i = 0; i < equiposPorGrupo; i++) {

        const equipo =
          equiposMezclados[indexEquipo];

        grupoActual.equipos.push(
          equipo.nombre_pais
        );

        indexEquipo++;

      }

      resultado.push(grupoActual);

    }


    // =====================================
    // RESPUESTA
    // =====================================

    res.status(200).json({

      ok: true,

      mensaje: "Vista previa generada",

      data: resultado

    });

  } catch (error) {

    next(error);

  }

};

const generarSorteo = async (req, res, next) => {

  try {

    const { cantidadGrupos } = req.body;


    // =====================================
    // VALIDAR CANTIDAD GRUPOS
    // =====================================

    if (!cantidadGrupos || cantidadGrupos <= 1) {

      return res.status(400).json({
        ok: false,
        mensaje:
          "La cantidad de grupos debe ser mayor a 1"
      });

    }


    // =====================================
    // OBTENER EQUIPOS
    // =====================================

    const equiposDB = await pool.query(
      `
      SELECT * FROM equipos
      `
    );


    // =====================================
    // OBTENER GRUPOS
    // =====================================

    const gruposDB = await pool.query(
      `
      SELECT * FROM grupos
      ORDER BY id ASC
      LIMIT $1
      `,
      [cantidadGrupos]
    );


    const equipos = equiposDB.rows;

    const grupos = gruposDB.rows;


    // =====================================
    // VALIDACIONES
    // =====================================

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


    // Validar grupos suficientes

    if (grupos.length < cantidadGrupos) {

      return res.status(400).json({
        ok: false,
        mensaje:
          "No existen suficientes grupos registrados"
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


    // =====================================
    // MEZCLAR EQUIPOS
    // =====================================

    const equiposMezclados = [...equipos].sort(
      () => Math.random() - 0.5
    );


    // =====================================
    // CREAR DISTRIBUCIÓN
    // =====================================

    const nuevaDistribucion = await pool.query(
      `
      INSERT INTO distribuciones (fecha)
      VALUES (CURRENT_TIMESTAMP)
      RETURNING *
      `
    );


    const distribucionId =
      nuevaDistribucion.rows[0].id;


    // =====================================
    // CANTIDAD POR GRUPO
    // =====================================

    const equiposPorGrupo =
      equipos.length / grupos.length;


    let indexEquipo = 0;

    const resultado = [];


    // =====================================
    // REPARTIR EQUIPOS
    // =====================================

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


    // =====================================
    // RESPUESTA
    // =====================================

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
  previewSorteo,
  generarSorteo,
  obtenerSorteos,
  obtenerSorteoPorId
};