import express from "express";
import leagueController from "../controllers/league.controller";

export const leagueRouter = express.Router()

leagueRouter
    .get('/', leagueController.getLeagues)
    .get('/all', leagueController.getLeagues)
    .get('/page/:page', leagueController.getLeaguesPage)
    .get('/single/:id', leagueController.getLeague)
    .get('/single/byName/:name', leagueController.getLeagueByName)