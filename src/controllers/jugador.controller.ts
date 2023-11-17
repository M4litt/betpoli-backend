import { Request, Response } from "express";
import mongoose from "mongoose";
import { Jugador, jugadorModel } from "../models/jugador.model";

export class JugadorController
{
    public static getAll(req:Request, res:Response)
    {
        jugadorModel.find()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }

    public static getOne(req:Request, res:Response) 
    {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id))    
            return res.status(400).json({'message': 'Invalid id'});
            
        jugadorModel.findById(id)
        .then(data => {
            
            if (!data) 
                return res.status(404).send("Jugador no encontrado");
                
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(err));
    }

    public static add(req:Request, res:Response)
    {
        const jugador:Jugador = req.body;

        if (!jugador.nombre      || !jugador.apellido || !jugador.edad     || 
            !jugador.posicion    || !jugador.dorsal   || !jugador.promedio || 
            !jugador.asistencias || !jugador.goles
        ) 
            return res.status(400).send("Faltan datos");

        jugadorModel.create(jugador)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }

    public static update(req:Request, res:Response)
    {
        const id = req.params.id;
        const jugador:Jugador = req.body;

        if (!mongoose.Types.ObjectId.isValid(id))    
            return res.status(400).json({'message': 'Invalid id'});
            
        jugadorModel.findByIdAndUpdate(id, jugador)
        .then(data => {
            
            if (!data) 
                return res.status(404).send("Jugador no encontrado");
                
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(err));
    }

    public static delete(req:Request, res:Response)
    {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({'message': 'Invalid id'});

        jugadorModel.findByIdAndDelete(id)
        .then(data => {
                
            if (!data) return res.status(404).send("Jugador no encontrado");
                    
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(err));
    }
}