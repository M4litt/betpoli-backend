import { Request, Response } from "express";
import { equipoModel } from "../models/equipo.model";
import { Equipo } from "../types/equipo.type";

export class EquipoController {

    public static getAll(req:Request, res:Response){
        equipoModel.find()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json(err));
    }
    
    public static getOne(req:Request, res:Response){
        const id = req.params.id;

        equipoModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send("Equipo no encontrado");
                return;
            }
            res.status(200).json(data)
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

    private static getIdByName(nombre:string):Promise<string|null> {
        return new Promise((resolve, reject) => {

            equipoModel.findOne({nombre: nombre})
            .then(data => {
                if (!data) {
                    return null;
                }
                return data._id;
            })
            .catch(err => {
                return null;
            });

        });
    }

}