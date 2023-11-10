import express from "express";
import { LigaController } from "../controllers/league.controller";

export const ligaRouter = express.Router()

ligaRouter
    .get('/', LigaController.getLeagues)
    .get('/all', LigaController.getLeagues)
    .get('/page/:page', LigaController.getLeaguesPage)
    .get('/single/:id', LigaController.getLeague)
    .get('/single/byName/:name', LigaController.getLeagueByName)