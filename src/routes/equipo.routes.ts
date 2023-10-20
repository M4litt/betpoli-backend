import express from 'express';
import { EquipoController } from '../controllers/equipo.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const equipoRouter = express.Router();

equipoRouter
.get   ('/',                           EquipoController.getAll)
.get   ('/:id',                        EquipoController.getOne)
.get   ('/nombre/:nombre',             EquipoController.getOneByName)
.post  ('/',               admin.auth, EquipoController.add)
.patch ('/:nombre',        admin.auth, EquipoController.patch)
.delete('/:id',            admin.auth, EquipoController.remove)
