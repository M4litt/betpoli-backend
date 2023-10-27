import express from "express";
import matchController from "../controllers/match.controller";

export const matchRouter = express.Router()

matchRouter
    .get('/', matchController.getMatches)
    .post('/', matchController.createMatch)
    .get('/all', matchController.getMatches)
    .get('/page/:page', matchController.getMatchesPage)
    .get('/single/:id', matchController.getMatch)
    .post('/single/:id/next', matchController.nextState)
