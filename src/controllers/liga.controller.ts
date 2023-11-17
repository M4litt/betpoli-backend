import { Liga, ligaModel } from '../models/liga.model';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Equipo, equipoModel } from '../models/equipo.model';
import { Pais } from '../models/pais.model';
import { jugadorModel } from '../models/jugador.model';

export class LigaController 
{
    public static getAll(req:Request, res:Response)
    {
        ligaModel.find()
        .then(ligas => res.status(200).json(ligas))
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
        .then(equipo => 
        {
            if (!equipo) 
                return res.status(400).json({ error: 'Liga not found' });    

            res.status(200).json(equipo)
 
        })
        .catch(err => res.status(400).json(err));
    }

    public static add(req:Request, res:Response)
    {
        const liga:Liga = req.body;

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

    // equipo

    public static getAllEquipos(req:Request, res:Response)
    {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).send('Invalid id');

        ligaModel.findById(id)
        .then(liga => {

            if (!liga) 
                return res.status(400).send('Liga not found');

            let threadPoll:Promise<any>[] = [];
            
            liga.equipos.forEach(id_equipo => threadPoll.push(
                new Promise((resolve, reject) => 
                {
                    equipoModel.findById(id_equipo)
                    .then(equipo => 
                    {
                        if (!equipo) return;
                        
                        let threadPoolJ:Promise<any>[] = [];
                        equipo.jugadores.forEach(id_jugador => threadPoolJ.push(jugadorModel.findById(id_jugador)));

                        Promise.all(threadPoolJ)
                        .then(data => resolve({
                            _id: equipo._id,
                            nombre: equipo.nombre,
                            escudo: equipo.escudo,
                            jugadores: data,
                        }))
                        .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
                })
            ));

            Promise.all(threadPoll)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }

    public static getOneEquipo(req:Request, res:Response)
    {
        const id = req.params.id;
        const id_equipo = req.params.id_equipo;

        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).send('Invalid id');

        ligaModel.findById(id)
        .then(liga => 
        {
            if (!liga) 
                return res.status(400).send('Liga not found');

            equipoModel.findById(id_equipo)
            .then(equipo => 
            {   
                if (!equipo) 
                    return res.status(400).send('Equipo not found');

                let threadPool:Promise<any>[] = [];
                equipo.jugadores.forEach(id_jugador => threadPool.push(jugadorModel.findById(id_jugador)));

                Promise.all(threadPool)
                .then(data => res.status(200).json({
                    _id: equipo._id,
                    nombre: equipo.nombre,
                    escudo: equipo.escudo,
                    jugadores: data,
                }))
                .catch(err => res.status(400).json(err));

            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }

    public static addEquipo(req:Request, res:Response)
    {
        const id = req.params.id;
        const id_equipo = req.params.id_equipo;

        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).json({ 'message': 'Invalid id' });

        ligaModel.findById(id)
        .then(data => {
            
            if (!data) return res.status(400).json({ 'message': 'Liga not found' });

            ligaModel.findByIdAndUpdate(id, { $push: { equipos: id_equipo } })
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));

        })
        .catch(err => res.status(400).json(err));
    }

    public static deleteEquipo(req:Request, res:Response)
    {
        const id = req.params.id;
        const nombre_equipo = req.params.nombre_equipo;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ 'message': 'Invalid id' });

        ligaModel.findById(id)
        .then(data => {
                
            if (!data) return res.status(400).json({ 'message': 'Liga not found' });
    
            const equipo = data.equipos.filter(equipo => { return equipo.nombre == nombre_equipo })[0];
    
            if (!equipo) return res.status(400).json({ 'message': 'Equipo not found' });
    
            ligaModel.findByIdAndUpdate(id, { $pull: { equipos: equipo } })
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
    
        })
    }

    public static updateEquipo(req:Request, res:Response)
    {
        const id = req.params.id;
        const nombre_equipo = req.params.nombre_equipo;
        const equipo:Equipo = req.body;

        if (!equipo.escudo || !equipo.nombre)
            return res.status(400).json({ 'message': 'Invalid data' });

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ 'message': 'Invalid id' });

        ligaModel.findById(id)
        .then(data => {

            if (!data) return res.status(400).json({ 'message': 'Liga not found' });

            const tmp_equipo = data.equipos.filter(equipo => { return equipo.nombre == nombre_equipo })[0];

            if (!tmp_equipo) return res.status(400).json({ 'message': 'Equipo not found' });

            ligaModel.findOneAndUpdate(
                { _id: id, 'equipos.nombre': { $eq: nombre_equipo }},
                { 'equipos.$': { nombre: equipo.nombre, escudo: equipo.escudo }}
            )
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));

    }

    // Pais 

    public static getPais(req:Request, res:Response)
    {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ 'message': 'Invalid id' });

        ligaModel.findById(id)
        .then(data => {    
            if (!data) return res.status(400).json({ 'message': 'Liga not found' });
            res.status(200).json(data?.pais);
        })
    }

    public static updatePais(req:Request, res:Response)
    {
        const id = req.params.id;
        const pais:Pais = req.body;

        if (!pais.nombre || !pais.codigoPais || !pais.bandera)
            return res.status(400).json({ 'message': 'Invalid data' });
        
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ 'message': 'Invalid id' });

        ligaModel.findById(id)
        .then(data => {
            if (!data) return res.status(400).json({ 'message': 'Liga not found' });
            ligaModel.findByIdAndUpdate(id, { pais: pais })
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        });
    }


}