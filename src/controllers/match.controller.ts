import { Request, Response } from "express";
import { matchModel } from "../models/match.model";
import { eventModel } from "../models/event.model";
import nextState from "../utils/stateSwitch";
import createObjMatch from "../utils/matchCreator";
import { InvalidMatchState } from "../utils/errors/invalidMatchState";
import matchStates from "../utils/constants/matchStates";
import createMatch from "../utils/createMatch";
import { periodistaModel } from "../models/periodista.model";

export class MatchController {

    public static async getMatches(req: Request, res: Response) {
        const matches = await matchModel.find()
        res.status(200).send(matches)
    }

    public static async getMatchesPage(req: Request, res: Response){
        const page = Number(req.params.page) < 1 ? 1 : Number(req.params.page)
        const limit = 15
        const matches = await matchModel.find().skip((page - 1) * limit).limit(limit)
        res.status(200).send(matches)
    }

    public static async getMatch(req: Request, res: Response){
        try {
            const match = await matchModel.findById(req.params.id)
            res.status(200).send(match)
        } catch (error: any) {
            console.error("Error getting match:", error);
            if (error.name === "CastError") {
                res.status(404).send({
                    statusCode: 404,
                    message: "Match not found",
                    id: error.value
                })
            }
        }
    }

    public static async createMatch(req: Request, res: Response) {
        const match = await matchModel.create(createMatch(
            req.body.local,
            req.body.visitante,
            req.body.fecha
        ))
        res.status(201).send(match)
    }

    public static async nextState(req: Request, res: Response){
        const match = await matchModel.findById(req.params.id)
        if (!match) {
            return res.status(404).send("Match not found")
        }

        const periodista = await periodistaModel.findOne(res.locals.decodedJWT);
        const objectIdStr = periodista!._id.toString();

        const optional_state_raw = req.body.estado
        console.log(optional_state_raw)

        // Check if the state is present
        if (optional_state_raw !== undefined){
            if (Object.values(matchStates).some((state: string) => state === optional_state_raw))
                return res.status(400).send("Invalid state")
        }

        const optional_state: matchStates = <matchStates> String(req.body.estado).toUpperCase();

        if (<matchStates> match.estado === optional_state)
            return res.status(304).send("Match already in that state")

        try {
            console.log(match.estado)
            const updatedMatch = await matchModel.findByIdAndUpdate(
                req.params.id,
                {estado: optional_state_raw != undefined ? nextState(match.estado, optional_state) : nextState(match.estado)},
                {new: true}
            )

            if (!updatedMatch) {
                return res.status(404).send("Match not found")
            }

            eventModel.create({
                idPartido: updatedMatch._id,
                nombre: "matchStateChange",
                equipo: "none",
                timestamp: Date.now(),
                minutos_totales: -1,
                minutos_parciales: -1,
                fueAnulado: false,
                idPeriodista: objectIdStr
            })
          
            console.log(updatedMatch)
            res.status(200).send(updatedMatch)

        } catch (error) {
            if (error instanceof InvalidMatchState) {
                return res.status(400).send(error.message)
            }

            console.error("Error updating match:", error);
            res.status(500).send("An error occurred while updating the match");
        }

        
    }
}