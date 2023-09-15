import { Router } from "express";
import bodyParser from 'body-parser';
import ApostadorController from "../controllers/Apostador.controller";

export let rutasUsuarios = Router();

rutasUsuarios.post("/registro", bodyParser.json(), ApostadorController.registro)
    .post("/verify", ApostadorController.verify)
    .post("/inicioSesion", ApostadorController.login)
    .post("/apostar", ApostadorController.Apostar)