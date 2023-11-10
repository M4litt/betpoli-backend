import express from 'express';
import { TeamController } from '../controllers/team.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const equipoRouter = express.Router();

equipoRouter
.get   ('/',                           TeamController.getTeams)
.get   ('/:id',                        TeamController.getTeam)
.get   ('/nombre/:nombre',             TeamController.getTeamByName)
.post  ('/',               admin.auth, TeamController.createTeam)