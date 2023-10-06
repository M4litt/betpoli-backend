import express from "express";
import eventController from "../controllers/event.controller";
import { auth } from "../middleware/auth.periodista.mw";

export const eventRouter = express.Router()

eventRouter
    .get('/placeholder',eventController.placeholder)
    .get('/', eventController.getGlobalEvents)
    .get('/:idPartido', eventController.getMatchEvents)
    .post('/', auth, eventController.createEvent)
    .patch('/:idPartido/:timestamp/anularEvento', auth, eventController.nullifyEvent) // Null and void
    //.patch('/:idPartido/:timestamp', auth, eventController.patchEvent) // Puede que no sea necesario
    .delete('/:idPartido/:timestamp', auth, eventController.deleteEvent) // Puede que no sea necesario