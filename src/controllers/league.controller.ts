import { Request, Response } from "express";
import { leagueModel } from "../models/league.model";
import createLeague from "../utils/createLeague";

export default {
    placeholder: (req: Request, res: Response) => {
        res.status(200).send('Response from league.controller')
    },

    getLeagues: async (req: Request, res: Response) => {
        const leagues = await leagueModel.find()
        res.status(200).send(leagues)
    },

    getLeaguesPage: async (req: Request, res: Response) => {
        const page = Number(req.params.page)
        const limit = 15
        const leagues = await leagueModel.find().skip((page - 1) * limit).limit(limit)
        res.status(200).send(leagues)
    },

    getLeague: async (req: Request, res: Response) => {
        try {
            const league = await leagueModel.findById(req.params.id)
            res.status(200).send(league)
        } catch (error: any) {
            console.error("Error getting league:", error);
            if (error.name === "CastError") {
                res.status(404).send({
                    statusCode: 404,
                    message: "League not found",
                    id: error.value
                })
            }
        }
    },

    getLeagueByName: async (req: Request, res: Response) => {
        try {
            const league = await leagueModel.findOne({ nombre: req.params.name })
            res.status(200).send(league)
        } catch (error: any) {
            console.error("Error getting league:", error);
            if (error.name === "CastError") {
                res.status(404).send({
                    statusCode: 404,
                    message: "League not found",
                    id: error.value
                })
            }
        }
    }
}