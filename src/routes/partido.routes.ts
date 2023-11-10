import express from "express";
import { auth as periodistaAuth } from "../middleware/auth.periodista.mw";
import { MatchController } from "../controllers/match.controller";

import { eventRouter } from "./event.routes";

export const partidoRouter = express.Router()

partidoRouter
    .get    ('/single/:id',         MatchController.getMatch)
    .get    ('/',                   MatchController.getMatches)
    .get    ('/all',                MatchController.getMatches)
    .get    ('/page/:page',         MatchController.getMatchesPage)
    .post   ('/',                   periodistaAuth, MatchController.createMatch)
    .post   ('/single/:id/next',    periodistaAuth, MatchController.nextState)

partidoRouter
    .use    ('eventos',             eventRouter)
    .use    ('events',              eventRouter)
