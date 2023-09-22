import jwt    from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import { createHash } from 'node:crypto';

import { Response, Request} from 'express';

// user
import { IPeriodista } from '../types/periodista.type';
import { periodistaModel } from '../models/periodista.model';
import { IPartido, Partido } from '../types/partido.type';
import { partidoModel } from '../models/partido.model';

// env
dotenv.config();

export class PeriodistaController {
    
    private static registerP(user:IPeriodista): Promise<any> {

        return new Promise((resolve, reject) => {
            periodistaModel.findOne({ mail: user.mail })
            .then(res => {
                if (res) {
                    reject("User already exists");
                    return;
                }
                user.password = this.sha256(user.password);
                periodistaModel.create(user)
                .then(res => resolve(res))
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
    }

    private static loginP(user:IPeriodista): Promise<any> {
        return new Promise((resolve, reject) => {
            periodistaModel.findOne({ mail: user.mail })
            .then(Iuser => {
                if (!Iuser) reject("User not found");
                if (Iuser?.password != this.sha256(user.password)) reject("Wrong password");
                resolve(this.getToken(user));
            })
            .catch(err => reject(err));
        });
    }

    private static getToken(user:IPeriodista): string {
        return jwt.sign(
            user,
            process.env.JWT_PERIODISTA_SECRET || '',
            { 
                expiresIn: '5h' 
            }
        );
    }

    private static sha256(content: string) {  
        return createHash('sha256').update(content).digest('hex')
    }

    public static register(req:Request, res:Response){
        const user: IPeriodista = req.body;

        PeriodistaController.registerP(user)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
    
    public static login(req:Request, res:Response){
        const user: IPeriodista = req.body;

        PeriodistaController.loginP(user)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static addPartido(req:Request, res:Response){
        const id = req.params.id;
        const id_partido = req.params.id_partido;

        periodistaModel.findByIdAndUpdate(
            id, 
            { $push: { partidos: id_partido } }
        )
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getPartidos(req:Request, res:Response){
        const id = req.params.id;

        periodistaModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(400).json({'message': 'Periodista not found'});
                return;
            }

            let out_partidos: any[] = [];

            data.partidos.forEach(partido => {

                partidoModel.findById(partido)
                .then(data => out_partidos.push(data))
                .catch(err => res.status(400).json({'message': err}))
                // nose si funciona esto

            })
            res.status(200).json(out_partidos)
        })
        .catch(err => res.status(400).json({'message': err}))
    }

    public static removePartido(req:Request, res:Response) {
        const id = req.params.id;

        periodistaModel.findById(id)
        .then(data => {
            
            if (!data) {
                res.status(400).json({'message': 'Periodista not found'});
                return;
            }

            periodistaModel.findByIdAndUpdate(
                id,
                { $pull: { partidos: { _id: req.body.partido._id } } }
            )
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))

        })
        .catch(err => res.status(400).json({'message': err}))
       
    }

    public static patch(req:Request, res:Response) 
    {
        const id = req.params.id;
        const periodista: IPeriodista = req.body;

        periodistaModel.findById(id)
        .then(data => {

            if (!data) {
                res.status(400).json({'message': 'Periodista not found'});
                return;
            }

            // reencriptar contraseña
            periodista.password = PeriodistaController.sha256(periodista.password);

            periodistaModel.findByIdAndUpdate(id, periodista)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))
    }

    public static delete(req:Request, res:Response)
    {
        const id = req.params.id;
        periodistaModel.findById(id)
        .then(data => {

            if (!data) 
            {
                res.status(400).json({'message': 'Periodista not found'});
                return;
            }

            periodistaModel.findByIdAndDelete(id)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getAll(req:Request, res:Response) 
    {
        periodistaModel.find()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getOne(req:Request, res:Response)
    {
        const id = req.params.id;
        periodistaModel.findById(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
    
}