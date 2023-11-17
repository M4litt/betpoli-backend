import { Request, Response } from "express";
import { equipoModel } from "../models/equipo.model";
import { Equipo } from "../models/equipo.model";
import mongoose, { mongo } from "mongoose";
import { Jugador, jugadorModel } from "../models/jugador.model";

export class EquipoController {

    public static getAll(req:Request, res:Response){
        equipoModel.find()
        .then(equipos => 
        {
            let equipoThreadPool:Promise<any>[] = [];

            equipos.forEach(equipo => equipoThreadPool.push(
                new Promise((resolve, reject) => 
                {
                    let playerThreadPool:Promise<Jugador | null>[] = [];
                    equipo.jugadores.forEach(id_jugador => playerThreadPool.push(jugadorModel.findById(id_jugador)));
                    
                    Promise.all(playerThreadPool)
                    .then(data => resolve({
                        _id: equipo._id,
                        nombre: equipo.nombre,
                        escudo: equipo.escudo,
                        jugadores: data,
                    }))
                    .catch(err => reject(err));
                })
            ));

            Promise.all(equipoThreadPool)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }
    
    public static getOne(req:Request, res:Response){
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send('Invalid id');
            return;
        }

        equipoModel.findById(id)
        .then(equipo => {
            
            if (!equipo) 
                return res.status(404).send("Equipo no encontrado");
                
            let threadPool:Promise<Jugador | null>[] = [];
            
            equipo.jugadores.forEach(id_jugador => threadPool.push(jugadorModel.findById(id_jugador)));
            
            Promise.all(threadPool)
            .then(data => res.status(200).json(
                {
                    _id: equipo._id,
                    nombre: equipo.nombre,
                    escudo: equipo.escudo,
                    jugadores: data,    
                })
            )
            .catch(err => res.status(400).json(err));

        })
        .catch(err => res.status(400).json(err));
    }
    
    public static getOneByName(req:Request, res:Response){
        const name = req.params.nombre;
        equipoModel.findOne({nombre: name})
        .then(data => {
            if (!data) {
                res.status(404).send("Equipo no encontrado");
                return;
            }
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(err));
    }

    public static add(req:Request, res:Response){
        const equipo:Equipo = req.body;

        equipoModel.findOne({nombre: equipo.nombre})
        .then(data => {
            if (data) {
                res.status(400).send("Equipo ya existe");
                return;
            }
            
            equipoModel.create(equipo)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));

        
    }

    public static remove(req:Request, res:Response){
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send('Invalid id');
            return;
        }

        equipoModel.findById(id)
        .then(data => {

            if (!data) {
                res.status(404).send("Equipo no encontrado");
                return;
            }

            equipoModel.findByIdAndRemove(id)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));

        })
        .catch(err => res.status(400).json(err));
    }

    public static patch(req:Request, res:Response){

        const name = req.params.nombre;
        const equipo:Equipo = req.body;

        if (!mongoose.Types.ObjectId.isValid(name)) {
            res.status(400).json('Invalid id');
            return;
        }

        // get id by name
        equipoModel.findOne({nombre: name})
        .then(data => {
            console.log(data)
            if (equipo == null) {
                res.status(404).send("Equipo no encontrado");
                return;
            }

            // update
            equipoModel.findByIdAndUpdate(data?._id, equipo)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));      

    }

    // jugadores
    public static getAllJugadores(req:Request, res:Response)
    {
        const id = req.params.id;

        let threadPool:Promise<Jugador | null>[] = [];

        equipoModel.findById(id)
        .then(equipo => {
            
            if (!equipo) 
                return res.status(404).send("Equipo no encontrado");
            
            equipo.jugadores.forEach(id_jugador => threadPool.push(jugadorModel.findById(id_jugador)));

            Promise.all(threadPool)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }

    public static getOneJugador(req:Request, res:Response)
    {
        const id         = req.params.id;
        const id_jugador = req.params.id_jugador;

        if (!mongoose.Types.ObjectId.isValid(id_jugador) || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send('Invalid id');

        equipoModel.findById(id)
        .then(data => {

            if (!data) 
                return res.status(404).send("Equipo no encontrado");

            const jugador = data.jugadores.filter(j => { return j == id_jugador })[0];
            
            if (!jugador)
                return res.status(404).send("Jugador no existe o no pertenece al equipo");
                
            jugadorModel.findById(id_jugador)
            .then(data => 
            {
                if (!data) 
                    return res.status(404).send("Jugador no encontrado");

                res.status(200).json(data)
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }

    public static addJugador(req:Request, res:Response)
    {
        const id = req.params.id;
        const id_jugador = req.params.id_jugador;

        if (!mongoose.Types.ObjectId.isValid(id_jugador) || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send('Invalid id');

        equipoModel.findById(id)
        .then(data => 
        {
            if (!data) 
                return res.status(404).send("Equipo no encontrado");

            if (data.jugadores.length >= 11) 
                return res.status(400).send("Equipo lleno");

            if (data.jugadores.find(j => j == id_jugador))
                return res.status(400).send("Jugador ya pertenece al equipo");

            jugadorModel.findById(id_jugador)
            .then(data => 
            {        
                if (!data) 
                    return res.status(404).send("Jugador no encontrado");

                equipoModel.findByIdAndUpdate(id, {$push: {jugadores: id_jugador}})
                .then(data => res.status(200).json(data))
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }

    public static removeJugador(req:Request, res:Response)
    {
        const id         = req.params.id;
        const id_jugador = req.params.id_jugador;

        if (!mongoose.Types.ObjectId.isValid(id_jugador) || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send('Invalid id');

        equipoModel.findById(id)
        .then(data => {

            if (!data) return res.status(404).send("Equipo no encontrado");

            const jugador = data.jugadores.find(j => j == id_jugador);

            if (!jugador) return res.status(404).send("Jugador no encontrado");

            equipoModel.findByIdAndUpdate(id, {$pull: {jugadores: id_jugador}})
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    }

    public static patchJugador(req:Request, res:Response)
    {
        const id               = req.params.id;
        const id_jugador_old   = req.params.id_jugador;
        const id_jugador_nuevo:string = req.body;

        if (!mongoose.Types.ObjectId.isValid(id_jugador_old) || !mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(id_jugador_nuevo))
            return res.status(400).send('Invalid id');

        equipoModel.findById(id)
        .then(data => {
            
            if (!data) return res.status(404).send("Equipo no encontrado");

            const tmp_jugador = data.jugadores.find(j => j == id_jugador_old );

            if (!tmp_jugador) return res.status(404).send("Jugador no encontrado");

            equipoModel.findOneAndUpdate(
                { _id: id, 'jugadores': id_jugador_old},
                { 'jugadores.$': id_jugador_nuevo},
            )
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err));
        });
    }

}