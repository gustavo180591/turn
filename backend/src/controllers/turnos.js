import pool from '../models/db.js';

// Crea un nuevo turno
export const crearTurno = async (req, res) => {
  try {
    const { nombre_usuario } = req.body;
    const result = await pool.query(
      'INSERT INTO turnos (nombre_usuario, estado) VALUES ($1, $2) RETURNING *',
      [nombre_usuario, 'en_fila_registro']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lista turnos por estado
export const listarTurnos = async (req, res) => {
  try {
    const { estado } = req.query;
    const result = await pool.query(
      'SELECT * FROM turnos WHERE estado = $1 ORDER BY hora_creacion ASC',
      [estado]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cambia a atendido_registro y pasa a en_fila_inmueble
export const atenderRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE turnos
       SET estado = 'en_fila_inmueble', hora_atendido_registro = NOW()
       WHERE id = $1 AND estado = 'en_fila_registro'
       RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Turno no encontrado o en estado incorrecto' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cambia a atendido_inmueble
export const atenderInmueble = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE turnos
       SET estado = 'atendido_inmueble', hora_atendido_inmueble = NOW()
       WHERE id = $1 AND estado = 'en_fila_inmueble'
       RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Turno no encontrado o en estado incorrecto' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Finaliza turno
export const finalizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE turnos
       SET estado = 'finalizado'
       WHERE id = $1 AND estado = 'atendido_inmueble'
       RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Turno no encontrado o en estado incorrecto' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};