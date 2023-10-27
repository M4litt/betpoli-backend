import { Router } from "express";
import ApuestaController from "../controllers/apuesta.controller";
import * as admin from '../middleware/auth.admin.middleware';

export let rutasApuestas = Router();

rutasApuestas
.post("/cerrarApuestas/:idPartido", admin.auth, ApuestaController.cerrarApuestas)