import express from 'express';
import { ApostadorController } from '../controllers/apostador.controller';
import { ApuestaController } from '../controllers/apuesta.controller';
import { auth as apostadorAuth } from  '../middleware/auth.apostador.middleware';
import { auth as adminAuth } from  '../middleware/auth.admin.middleware'
import bodyParser from 'body-parser';

export const apostadorRouter = express.Router();

apostadorRouter
.post   ("/registro",                   bodyParser.json(), ApostadorController.registro)
.post   ("/verify",                     ApostadorController.verify)
.post   ("/inicioSesion",               ApostadorController.login)

.post   ("/apostar",                    apostadorAuth, ApostadorController.apostar)
.get    ("/single/:DNI",                apostadorAuth,  ApostadorController.getOne)
.delete ("/:DNI",                       apostadorAuth,  ApostadorController.delete)
.patch  ("/:DNI",                       apostadorAuth,  ApostadorController.modify)
.post   ("/cerrarApuestas/:idPartido",  adminAuth,      ApuestaController.cerrarApuestas)
.get    ('/:id',                        adminAuth,      ApostadorController.getOne)
.get    ('/',                           adminAuth,      ApostadorController.getAll)
.get    ("/all",                        adminAuth,      ApostadorController.getAll)
.delete ('/:id',                        adminAuth,      ApostadorController.delete)
