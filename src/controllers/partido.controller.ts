import { Request, Response } from 'express'
import { partidoModel } from '../models/partido.model'
import { IPartido } from '../types/partido.type';

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

    public static add(req:Request, res:Response)
    {
        const partido:IPartido = req.body;
        partidoModel.create(partido)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }

    public static patch(req:Request, res:Response)
    {
        const id = req.params.id;
        const partido:IPartido = req.body;

        partidoModel.findById(id)
        .then(data => {
            if (!data)
            {
                res.status(400).json({'message': 'Partido not found'});
                return;
            }

            partidoModel.findByIdAndUpdate(id, partido)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json(err));
    }

    public static delete(req:Request, res:Response)
    {
        const id = req.params.id;
        partidoModel.findById(id)
        .then(data => {
            if (!data)
            {
                res.status(400).json({'message': 'Partido not found'});
                return;
            }

            partidoModel.findByIdAndDelete(id)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json(err));
    }
}