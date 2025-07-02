import express from 'express';
import {
  crearTurno,
  listarTurnos,
  atenderRegistro,
  atenderInmueble,
  finalizarTurno
} from '../controllers/turnos.js';

const router = express.Router();

router.post('/', crearTurno);
router.get('/', listarTurnos);
router.post('/:id/atender-registro', atenderRegistro);
router.post('/:id/atender-inmueble', atenderInmueble);
router.post('/:id/finalizar', finalizarTurno);

export default router;