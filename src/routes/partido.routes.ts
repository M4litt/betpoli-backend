import express from 'express';
import { PartidoController } from '../controllers/partido.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const partidoRouter = express.Router();

partidoRouter
.get   ('/',                PartidoController.getAll)
.get   ('/:id',             PartidoController.getOne)
.post  ('/',    admin.auth, PartidoController.add)
.patch ('/:id', admin.auth, PartidoController.patch)
.delete('/:id', admin.auth, PartidoController.delete)