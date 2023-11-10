import { Request, Response } from "express";
import { Liga, ligaModel } from "../models/liga.model";
import createLeague from "../utils/createLeague";
import { mongoose } from "@typegoose/typegoose";

export class LigaController {
    public static async getLeagues(req: Request, res: Response){
        const leagues = await ligaModel.find()
        res.status(200).send(leagues)
    }

    public static async getLeaguesPage(req: Request, res: Response){
        const page = Number(req.params.page)
        const limit = 15
        const leagues = await ligaModel.find().skip((page - 1) * limit).limit(limit)
        res.status(200).send(leagues)
    }

    public static async getLeague(req: Request, res: Response){
        try {
            const league = await ligaModel.findById(req.params.id)
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

    public static async getLeagueByName(req: Request, res: Response){
        try {
            const league = await ligaModel.findOne({ nombre: req.params.name })
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

    public static update(req:Request, res:Response)
    {
        const id = req.params.id;
        const liga:Liga = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ 'message': 'Invalid id' });
            return;
        }

        ligaModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(400).json({ 'message': 'Liga not found' });
                return;
            }
            ligaModel.findByIdAndUpdate(id, liga)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }

    public static delete(req:Request, res:Response)
    {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ 'message': 'Invalid id' });
            return;
        }

        ligaModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(400).json({ 'message': 'Liga not found' });
                return;
            }
            ligaModel.findByIdAndDelete(id)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
    }
}