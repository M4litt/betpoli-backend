import { Request, Response } from 'express'
import { Partido, partidoModel } from '../models/partido.model'
import mongoose from 'mongoose';
import { ligaModel } from '../models/liga.model';
import { Equipo, equipoModel } from '../models/equipo.model';

export class PartidoController {
    public static getAll(req: Request, res: Response) {
        partidoModel.find()
        .then(partidos => 
        {
            let threadPool:Promise<any>[] = [];
            partidos.forEach(partido => threadPool.push(
                new Promise((resolve, reject) => {
                    ligaModel.findById(partido.liga)
                    .then(liga => 
                    {
                        let threadPoolEquipo:Promise<any>[] = [];
                        liga?.equipos.forEach(equipo => threadPoolEquipo.push(equipoModel.findById(equipo)));
                        Promise.all(threadPoolEquipo)
                        .then(equipos => 
                        {
                            resolve({
                                _id:           partido._id,
                                local:         partido.local,
                                visitante:     partido.visitante,
                                gol_local:     partido.gol_local,
                                gol_visitante: partido.gol_visitante,
                                estado:        partido.estado,
                                fecha:         partido.fecha,
                                liga:          {
                                    _id:    liga?._id,
                                    nombre: liga?.nombre,
                                    pais:   liga?.pais,
                                    escudo: liga?.escudo,
                                }
                            })
                        })
                        .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
                })
            ));

            Promise.all(threadPool)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }

    public static getOne(req: Request, res: Response) {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({'message': 'Invalid id'});
            return;
        }

        partidoModel.findById(id)
        .then(partido => 
        {
            if (!partido)
                return res.status(400).send('Partido not found');

            ligaModel.findById(partido.liga)
            .then(liga =>
                res.status(200).json({
                    local:         partido.local,
                    visitante:     partido.visitante,
                    gol_local:     partido.gol_local,
                    gol_visitante: partido.gol_visitante,
                    estado:        partido.estado,
                    fecha:         partido.fecha,
                    liga:          liga
                })
            )
            .catch(err => res.status(400).json(err))
        })
        .catch(err => res.status(400).json(err));
    }

    public static add(req:Request, res:Response)
    {
        const partido:Partido = req.body;

        if (partido.local == partido.visitante) 
        {
            res.status(400).json({'message': 'Un equipo no puede jugar contra si mismo'});
            return;
        }

        partidoModel.create(partido)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }

    public static patch(req:Request, res:Response)
    {
        const id = req.params.id;
        const partido:Partido = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({'message': 'Invalid id'});
            return;
        }

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

        if (!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({'message': 'Invalid id'});
            return;
        }

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