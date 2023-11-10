import express from "express";
import { EventController} from "../controllers/event.controller";
import { auth as periodistaAuth } from "../middleware/auth.periodista.mw";

export const eventRouter = express.Router()

eventRouter
    .get    ('/',                                                   EventController.getAllEvents)
    .get    ('/:idPartido',                                         EventController.getMatchEvents)
    .post   ('/',                                   periodistaAuth, EventController.createEvent)
    .patch  ('/:idPartido/:timestamp/anularEvento', periodistaAuth, EventController.nullifyEvent) // Null and void
    .delete ('/:idPartido/:timestamp',              periodistaAuth, EventController.deleteEvent) // Puede que no sea necesario