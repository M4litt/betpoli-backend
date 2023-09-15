import express from 'express';
import { EquipoController } from '../controllers/equipo.controller';

export const equipoRouter = express.Router();

equipoRouter
.get('/', EquipoController.getAll)
.get('/:id', EquipoController.getOne)
.get('/nombre/:nombre', EquipoController.getOneByName)
.post('/', EquipoController.add)
.patch('/:nombre', EquipoController.patch)
.delete('/:id', EquipoController.remove)
