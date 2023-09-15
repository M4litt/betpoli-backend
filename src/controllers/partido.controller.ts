import { Request, Response } from 'express'
import { partidoModel } from '../models/partido.model'

export class PartidoController {
    public static getAll(req: Request, res: Response) {
        partidoModel.find()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }

    public static getOne(req: Request, res: Response) {
        partidoModel.findById(req.params.id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }
}