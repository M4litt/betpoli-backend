import * as admin from '../middleware/auth.admin.middleware'
import { PeriodistaController } from '../controllers/periodista.controller';
import express from 'express';

export const PeriodistaRouter = express.Router();


PeriodistaRouter
.post  ('/register',                             PeriodistaController.register)
.post  ('/login',                                PeriodistaController.login)
.get   ('/:id/partidos',                         PeriodistaController.getPartidos)
.get   ('/:id',                      admin.auth, PeriodistaController.getOne)
.get   ('/',                         admin.auth, PeriodistaController.getAll)
.post  ('/:id/partidos/:id_partido', admin.auth, PeriodistaController.addPartido)
.delete('/:id',                      admin.auth, PeriodistaController.delete)
.patch ('/:id',                      admin.auth, PeriodistaController.patch)
.delete('/:id/partidos/',            admin.auth, PeriodistaController.removePartido)
