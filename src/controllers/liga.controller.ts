import { Liga, ligaModel } from '../models/liga.model';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export class LigaController 
{
    public static getAll(req:Request, res:Response)
    {
        ligaModel.find()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }

    public static getOne(req:Request, res:Response)
    {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid id' });
            return;
        }

        ligaModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(400).json({ error: 'Liga not found' });
                return;
            }
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(err));
    }

    public static add(req:Request, res:Response)
    {
        const liga = req.body;

        ligaModel.create(liga)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
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