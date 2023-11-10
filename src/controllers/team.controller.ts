import { Request, Response } from "express";
import { teamModel } from "../models/team.model";
import createTeam from "../utils/createTeam";

export class TeamController {
    public static placeholder (req: Request, res: Response) {
        res.status(200).send('Response from team.controller')
    }

    public static async getTeams(req: Request, res: Response) {
        const teams = await teamModel.find()
        res.status(200).send(teams)
    }

    public static async getTeamsPage(req: Request, res: Response) {
        const page = Number(req.params.page)
        const limit = 15
        const teams = await teamModel.find().skip((page - 1) * limit).limit(limit)
        res.status(200).send(teams)
    }

    public static async getTeam(req: Request, res: Response) {
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
    }

    public static async getTeamByName(req: Request, res: Response) {
        try {
            const team = await teamModel.findOne({ nombre: req.params.nombre })
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
    }

    public static async createTeam(req: Request, res: Response) {
        const team = await teamModel.create(createTeam(
            req.body.nombre,
            req.body.escudo
        ))
        res.status(201).send(team)
    }
}