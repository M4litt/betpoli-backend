import express from "express";
import matchController from "../controllers/match.controller";

export const matchRouter = express.Router()

matchRouter
    .get('/', matchController.getMatches)
    .get('/:id', matchController.getMatch)
    .get('/all', matchController.getMatches)
    .post('/', matchController.createMatch)