import express from "express";
import matchController from "../controllers/match.controller";
import { auth } from "../middleware/auth.periodista.mw";

export const partidoRouter = express.Router()

partidoRouter
    .get('/', matchController.getMatches)
    .post('/', matchController.createMatch)
    .get('/all', matchController.getMatches)
    .get('/page/:page', matchController.getMatchesPage)
    .get('/single/:id', matchController.getMatch)
    .post('/single/:id/next', auth, matchController.nextState)
