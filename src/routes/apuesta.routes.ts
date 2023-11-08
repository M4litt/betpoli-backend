import { Router } from "express";
import bodyParser from 'body-parser';
import ApuestaController from "../controllers/Apuesta.controller";
import * as admin from '../middleware/auth.admin.middleware';

export let rutasApuestas = Router();

rutasApuestas
.post("/cerrarApuestas/:idPartido", admin.auth, ApuestaController.cerrarApuestas)
