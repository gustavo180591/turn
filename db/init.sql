-- Inicialización de la base de datos de turnos
-- Este archivo se ejecuta automáticamente al crear la base de datos

CREATE TABLE turnos (
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

-- Insertar algunos datos de prueba (opcional)
INSERT INTO turnos (nombre_usuario, estado) VALUES 
('Juan Pérez', 'en_fila_registro'),
('María García', 'en_fila_registro'),
('Carlos López', 'en_fila_inmueble'); 