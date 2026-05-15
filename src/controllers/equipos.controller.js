const pool = require("../db/connection");

const validarEquipo = require("../utils/validarEquipo");


// =========================================
// CREAR EQUIPO
// =========================================

const crearEquipo = async (req, res, next) => {
  try {

    const {
      nombre_pais,
      codigo_fifa,
      director_tecnico,
      ranking_fifa,
      jugadores_inscritos
    } = req.body;

    // Validar campos vacíos

    if (
      !nombre_pais ||
      !codigo_fifa ||
      !director_tecnico ||
      !ranking_fifa ||
      !jugadores_inscritos
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Todos los campos son obligatorios"
      });
    }

    // Validaciones

    const validacion = validarEquipo({
      codigo_fifa,
      ranking_fifa,
      jugadores_inscritos
    });

    if (!validacion.ok) {
      return res.status(400).json(validacion);
    }

    // Verificar país duplicado

    const paisExiste = await pool.query(
      `
      SELECT * FROM equipos
      WHERE nombre_pais = $1
      `,
      [nombre_pais]
    );

    if (paisExiste.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El país ya existe"
      });
    }

    // Verificar código FIFA duplicado

    const fifaExiste = await pool.query(
      `
      SELECT * FROM equipos
      WHERE codigo_fifa = $1
      `,
      [codigo_fifa.toUpperCase()]
    );

    if (fifaExiste.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El código FIFA ya existe"
      });
    }

    // Insertar equipo

    const resultado = await pool.query(
      `
      INSERT INTO equipos
      (
        nombre_pais,
        codigo_fifa,
        director_tecnico,
        ranking_fifa,
        jugadores_inscritos
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        nombre_pais,
        codigo_fifa.toUpperCase(),
        director_tecnico,
        ranking_fifa,
        jugadores_inscritos
      ]
    );

    res.status(201).json({
      ok: true,
      mensaje: "Equipo creado correctamente",
      data: resultado.rows[0]
    });

  } catch (error) {

    next(error);

  }
};


// =========================================
// OBTENER TODOS
// =========================================

const obtenerEquipos = async (req, res, next) => {
  try {

    const resultado = await pool.query(
      `
      SELECT * FROM equipos
      ORDER BY id ASC
      `
    );

    res.status(200).json({
      ok: true,
      mensaje: "Equipos obtenidos",
      data: resultado.rows
    });

  } catch (error) {

    next(error);

  }
};


// =========================================
// OBTENER POR ID
// =========================================

const obtenerEquipoPorId = async (req, res, next) => {
  try {

    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT * FROM equipos
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Equipo no encontrado"
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: "Equipo obtenido",
      data: resultado.rows[0]
    });

  } catch (error) {

    next(error);

  }
};


// =========================================
// ACTUALIZAR EQUIPO
// =========================================

const actualizarEquipo = async (req, res, next) => {
  try {

    const { id } = req.params;

    const {
      nombre_pais,
      codigo_fifa,
      director_tecnico,
      ranking_fifa,
      jugadores_inscritos
    } = req.body;

    // Verificar existencia

    const equipoExiste = await pool.query(
      `
      SELECT * FROM equipos
      WHERE id = $1
      `,
      [id]
    );

    if (equipoExiste.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Equipo no encontrado"
      });
    }

    // Validar campos

    if (
      !nombre_pais ||
      !codigo_fifa ||
      !director_tecnico ||
      !ranking_fifa ||
      !jugadores_inscritos
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Todos los campos son obligatorios"
      });
    }

    // Validaciones

    const validacion = validarEquipo({
      codigo_fifa,
      ranking_fifa,
      jugadores_inscritos
    });

    if (!validacion.ok) {
      return res.status(400).json(validacion);
    }

    // Validar país duplicado

    const paisDuplicado = await pool.query(
      `
      SELECT * FROM equipos
      WHERE nombre_pais = $1
      AND id != $2
      `,
      [nombre_pais, id]
    );

    if (paisDuplicado.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El país ya existe"
      });
    }

    // Validar FIFA duplicado

    const fifaDuplicado = await pool.query(
      `
      SELECT * FROM equipos
      WHERE codigo_fifa = $1
      AND id != $2
      `,
      [codigo_fifa.toUpperCase(), id]
    );

    if (fifaDuplicado.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El código FIFA ya existe"
      });
    }

    // Actualizar

    const resultado = await pool.query(
      `
      UPDATE equipos
      SET
        nombre_pais = $1,
        codigo_fifa = $2,
        director_tecnico = $3,
        ranking_fifa = $4,
        jugadores_inscritos = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        nombre_pais,
        codigo_fifa.toUpperCase(),
        director_tecnico,
        ranking_fifa,
        jugadores_inscritos,
        id
      ]
    );

    res.status(200).json({
      ok: true,
      mensaje: "Equipo actualizado correctamente",
      data: resultado.rows[0]
    });

  } catch (error) {

    next(error);

  }
};


// =========================================
// ELIMINAR EQUIPO
// =========================================

const eliminarEquipo = async (req, res, next) => {
  try {

    const { id } = req.params;

    const equipoExiste = await pool.query(
      `
      SELECT * FROM equipos
      WHERE id = $1
      `,
      [id]
    );

    if (equipoExiste.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Equipo no encontrado"
      });
    }

    await pool.query(
      `
      DELETE FROM equipos
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      ok: true,
      mensaje: "Equipo eliminado correctamente"
    });

  } catch (error) {

    next(error);

  }
};


module.exports = {
  crearEquipo,
  obtenerEquipos,
  obtenerEquipoPorId,
  actualizarEquipo,
  eliminarEquipo
};