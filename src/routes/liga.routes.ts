import { Router } from 'express';
import { LigaController } from '../controllers/liga.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const ligaRouter = Router();

ligaRouter

.get   ('/',                                   LigaController.getAll       )
.get   ('/:id',                                LigaController.getOne       )
.post  ('/',                       admin.auth, LigaController.add          )
.put   ('/:id',                    admin.auth, LigaController.update       )
.delete('/:id',                    admin.auth, LigaController.delete       )

.get   ('/:id/equipos',            admin.auth, LigaController.getAllEquipos)
.get   ('/:id/equipos/:id_equipo', admin.auth, LigaController.getOneEquipo )
.post  ('/:id/equipos/:id_equipo', admin.auth, LigaController.addEquipo    )
.delete('/:id/equipos/:id_equipo', admin.auth, LigaController.deleteEquipo )
.put   ('/:id/equipos/:id_equipo', admin.auth, LigaController.updateEquipo )

.get   ('/:id/pais',               admin.auth, LigaController.getPais      )
.put   ('/:id/pais',               admin.auth, LigaController.updatePais   )