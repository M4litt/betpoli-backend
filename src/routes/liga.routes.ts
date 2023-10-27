import { Router } from 'express';
import { LigaController } from '../controllers/liga.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const ligaRouter = Router();

ligaRouter
.get   ('/',                LigaController.getAll)
.get   ('/:id',             LigaController.getOne)
.post  ('/',    admin.auth, LigaController.add   )
.put   ('/:id', admin.auth, LigaController.update)
.delete('/:id', admin.auth, LigaController.delete)