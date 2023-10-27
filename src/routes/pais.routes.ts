import { Router } from 'express';
import { PaisController } from '../controllers/pais.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const paisRouter = Router();

paisRouter
.get('/',                   PaisController.getAll)
.get('/:id',                PaisController.getOne)
.post('/',      admin.auth, PaisController.add   )
.put('/:id',    admin.auth, PaisController.update)
.delete('/:id', admin.auth, PaisController.delete)