import { Router } from "express";
import ApostadorController from "../controllers/Apostador.controller";

import { verificarClave } from "../middleware/jwt";

export let rutasUsuarios = Router();

rutasUsuarios
.post("/registro", ApostadorController.registro)
.post("/verify", ApostadorController.verify)
.post("/inicioSesion", ApostadorController.login)
.post("/apostar", verificarClave, ApostadorController.Apostar)
.get("/all", ApostadorController.getAll)
.get("/single/:DNI", ApostadorController.getOne)
.delete("/:DNI", ApostadorController.delete)
.post("/", ApostadorController.post)
.patch("/:DNI", ApostadorController.modify)