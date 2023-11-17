import express from 'express';
import { EquipoController } from '../controllers/equipo.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const equipoRouter = express.Router();

equipoRouter

.get   ('/',                                      EquipoController.getAll         )
.get   ('/:id',                                   EquipoController.getOne         )
.get   ('/nombre/:nombre',                        EquipoController.getOneByName   )
.post  ('/',                          admin.auth, EquipoController.add            )
.patch ('/:nombre',                   admin.auth, EquipoController.patch          )
.delete('/:id',                       admin.auth, EquipoController.remove         )

.get   ('/:id/jugadores',                         EquipoController.getAllJugadores)
.get   ('/:id/jugadores/:id_jugador',             EquipoController.getOneJugador  )
.post  ('/:id/jugadores/:id_jugador', admin.auth, EquipoController.addJugador     )
.delete('/:id/jugadores/:id_jugador', admin.auth, EquipoController.removeJugador  )
.patch ('/:id/jugadores/:id_jugador', admin.auth, EquipoController.patchJugador   )
