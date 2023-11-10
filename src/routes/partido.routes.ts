import express from "express";
import { auth } from "../middleware/auth.periodista.mw";
import { MatchController } from "../controllers/match.controller";

import { eventRouter } from "./event.routes";

export const partidoRouter = express.Router()

partidoRouter
    .get('/', MatchController.getMatches)
    .post('/', MatchController.createMatch)
    .get('/all', MatchController.getMatches)
    .get('/page/:page', MatchController.getMatchesPage)
    .get('/single/:id', MatchController.getMatch)
    .post('/single/:id/next', auth, MatchController.nextState)

partidoRouter
    .use('eventos', eventRouter).use('events', eventRouter)
