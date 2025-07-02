-- Crear la tabla de turnos si no existe
CREATE TABLE IF NOT EXISTS turnos (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(100) NOT NULL,
  estado VARCHAR(30) NOT NULL CHECK (
    estado IN (
      'en_fila_registro',
      'atendido_registro',
      'en_fila_inmueble',
      'atendido_inmueble',
      'finalizado',
      'cancelado'
    )
  ),
  hora_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
  hora_atendido_registro TIMESTAMP,
  hora_atendido_inmueble TIMESTAMP,
  observaciones TEXT
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_turnos_estado ON turnos(estado);
CREATE INDEX IF NOT EXISTS idx_turnos_hora_creacion ON turnos(hora_creacion);
