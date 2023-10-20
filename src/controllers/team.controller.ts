import { Request, Response } from "express";
import { teamModel } from "../models/team.model";
import createTeam from "../utils/createTeam";

export default {
    placeholder: (req: Request, res: Response) => {
        res.status(200).send('Response from team.controller')
    },

    getTeams: async (req: Request, res: Response) => {
        const teams = await teamModel.find()
        res.status(200).send(teams)
    },

    getTeamsPage: async (req: Request, res: Response) => {
        const page = Number(req.params.page)
        const limit = 15
        const teams = await teamModel.find().skip((page - 1) * limit).limit(limit)
        res.status(200).send(teams)
    },

    getTeam: async (req: Request, res: Response) => {
        try {
            const team = await teamModel.findById(req.params.id)
            res.status(200).send(team)
        } catch (error: any) {
            console.error("Error getting team:", error);
            if (error.name === "CastError") {
                res.status(404).send({
                    statusCode: 404,
                    message: "Team not found",
                    id: error.value
                })
            }
        }
    },

    createTeam: async (req: Request, res: Response) => {
        const team = await teamModel.create(createTeam(
            req.body.nombre,
            req.body.escudo
        ))
        res.status(201).send(team)
    },
}