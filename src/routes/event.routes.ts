import express from "express";
import eventController from "../controllers/event.controller";
import e from "express";

export const eventRouter = express.Router()

eventRouter
    .get('/placeholder',eventController.placeholder)
    .get('/', eventController.getGlobalEvents)
    .get('/:idPartido', eventController.getMatchEvents)
    .post('/', eventController.createEvent)
    .patch('/:idPartido/:timestamp/anularEvento', eventController.nullifyEvent) // Null and void
    //.patch('/:idPartido/:timestamp', eventController.patchEvent) // Puede que no sea necesario
    .delete('/:idPartido/:timestamp', eventController.deleteEvent) // Puede que no sea necesario