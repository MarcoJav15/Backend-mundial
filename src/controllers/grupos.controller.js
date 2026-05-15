const pool = require("../db/connection");


// =====================================
// CREAR GRUPO
// =====================================

const crearGrupo = async (req, res, next) => {

  try {

    const {
      nombre,
      descripcion
    } = req.body;

    if (!nombre || !descripcion) {

      return res.status(400).json({
        ok: false,
        mensaje: "Todos los campos son obligatorios"
      });

    }

    // Verificar duplicado

    const grupoExiste = await pool.query(
      `
      SELECT * FROM grupos
      WHERE nombre = $1
      `,
      [nombre]
    );

    if (grupoExiste.rows.length > 0) {

      return res.status(400).json({
        ok: false,
        mensaje: "El grupo ya existe"
      });

    }

    // Insertar

    const resultado = await pool.query(
      `
      INSERT INTO grupos
      (
        nombre,
        descripcion
      )
      VALUES ($1, $2)
      RETURNING *
      `,
      [nombre, descripcion]
    );

    res.status(201).json({
      ok: true,
      mensaje: "Grupo creado correctamente",
      data: resultado.rows[0]
    });

  } catch (error) {

    next(error);

  }

};


// =====================================
// OBTENER GRUPOS
// =====================================

const obtenerGrupos = async (req, res, next) => {

  try {

    const resultado = await pool.query(
      `
      SELECT * FROM grupos
      ORDER BY id ASC
      `
    );

    res.status(200).json({
      ok: true,
      mensaje: "Grupos obtenidos",
      data: resultado.rows
    });

  } catch (error) {

    next(error);

  }

};


// =====================================
// OBTENER GRUPO POR ID
// =====================================

const obtenerGrupoPorId = async (req, res, next) => {

  try {

    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT * FROM grupos
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {

      return res.status(404).json({
        ok: false,
        mensaje: "Grupo no encontrado"
      });

    }

    res.status(200).json({
      ok: true,
      mensaje: "Grupo obtenido",
      data: resultado.rows[0]
    });

  } catch (error) {

    next(error);

  }

};


// =====================================
// ACTUALIZAR GRUPO
// =====================================

const actualizarGrupo = async (req, res, next) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      descripcion
    } = req.body;

    if (!nombre || !descripcion) {

      return res.status(400).json({
        ok: false,
        mensaje: "Todos los campos son obligatorios"
      });

    }

    // Validar existencia

    const grupoExiste = await pool.query(
      `
      SELECT * FROM grupos
      WHERE id = $1
      `,
      [id]
    );

    if (grupoExiste.rows.length === 0) {

      return res.status(404).json({
        ok: false,
        mensaje: "Grupo no encontrado"
      });

    }

    // Validar duplicado

    const duplicado = await pool.query(
      `
      SELECT * FROM grupos
      WHERE nombre = $1
      AND id != $2
      `,
      [nombre, id]
    );

    if (duplicado.rows.length > 0) {

      return res.status(400).json({
        ok: false,
        mensaje: "El grupo ya existe"
      });

    }

    // Actualizar

    const resultado = await pool.query(
      `
      UPDATE grupos
      SET
        nombre = $1,
        descripcion = $2
      WHERE id = $3
      RETURNING *
      `,
      [nombre, descripcion, id]
    );

    res.status(200).json({
      ok: true,
      mensaje: "Grupo actualizado correctamente",
      data: resultado.rows[0]
    });

  } catch (error) {

    next(error);

  }

};


// =====================================
// ELIMINAR GRUPO
// =====================================

const eliminarGrupo = async (req, res, next) => {

  try {

    const { id } = req.params;

    const grupoExiste = await pool.query(
      `
      SELECT * FROM grupos
      WHERE id = $1
      `,
      [id]
    );

    if (grupoExiste.rows.length === 0) {

      return res.status(404).json({
        ok: false,
        mensaje: "Grupo no encontrado"
      });

    }

    await pool.query(
      `
      DELETE FROM grupos
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      ok: true,
      mensaje: "Grupo eliminado correctamente"
    });

  } catch (error) {

    next(error);

  }

};


module.exports = {
  crearGrupo,
  obtenerGrupos,
  obtenerGrupoPorId,
  actualizarGrupo,
  eliminarGrupo
};