import mongoose from "mongoose";
import { Pais, paisModel } from "../models/pais.model";
import { Request, Response } from "express";

export class PaisController 
{
    public static getAll(req:Request, res:Response)
    {
        paisModel.find()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }

    public static getOne(req:Request, res:Response)
    {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ 'message': 'Invalid id' });
            return;
        }

        paisModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(400).json({ 'message': 'Pais not found' });
                return;
            }
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(err));
    }

    public static add(req:Request, res:Response)
    {
        const pais:Pais = req.body;
        
        // nose si hacer por nombre o codigo de pais
        paisModel.find({pais: pais.codigoPais})
        .then(data => {
            if(data.length != 0){
                res.status(400).json({ 'message': 'Pais already exists' });
                return;
            }

            paisModel.create(pais)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })

    }

    public static update(req:Request, res:Response)
    {
        const id = req.params.id;
        const pais:Pais = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ 'message': 'Invalid id' });
            return;
        }

        paisModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(400).json({ 'message': 'Pais not found' });
                return;
            }
            paisModel.findByIdAndUpdate(id, pais)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
    }

    public static delete(req:Request, res:Response)
    {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ 'message': 'Invalid id' });
            return;
        }

        paisModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(400).json({ 'message': 'Pais not found' });
                return;
            }
            paisModel.findByIdAndDelete(id)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
    }
}