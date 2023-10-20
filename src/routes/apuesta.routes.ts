import { Router } from "express";
import bodyParser from 'body-parser';
import ApuestaController from "../controllers/Apuesta.controller";

export let rutasApuestas = Router();

rutasApuestas.post("/cerrarApuestas/:idPartido", ApuestaController.cerrarApuestas)