import jwt    from 'jsonwebtoken'
import dotenv from 'dotenv'
import { createHash } from 'node:crypto';
import { Response, Request} from 'express';
import mongoose, { mongo } from 'mongoose';

// user
import { IPeriodista } from '../types/periodista.type';
import { periodistaModel } from '../models/periodista.model';
import { IPartido, Partido } from '../types/partido.type';
import { partidoModel } from '../models/partido.model';
import fileUpload from 'express-fileupload';

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

        // chequear si la id es valida, sino crashea aa
        if (!mongoose.Types.ObjectId.isValid(id_partido)){
            res.status(400).json({'message': 'Invalid partido id'});
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({'message': 'Invalid periodista id'});
            return;
        }

        partidoModel.findById(id_partido)
        .then(data => {
            // if not found
            if (!data) {
                res.status(400).json({'message': 'Partido not found'});
                return;
            }
            // push partido
            periodistaModel.findByIdAndUpdate(
                id, 
                { $push: { partidos: id_partido } }
            )
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
    }

    public static getPartidos(req:Request, res:Response){
        const id = req.params.id;

        periodistaModel.findById(id)
        .then(data => {
            if (!data) {
                res.status(400).json({'message': 'Periodista not found'});
                return;
            }
            PeriodistaController.getPartidosList(data.partidos)
            .then(output => res.status(200).json(output))
            .catch(err => res.status(400).json({'message': err}))
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

        if (!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({'message': 'Invalid id'});
            return;
        }

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

        if (!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({'message': 'Invalid id'});
            return;
        }

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

        if (!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({'message': 'Invalid id'});
            return;
        }

        periodistaModel.findById(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    // habia problemas de sincronizacion asi que lo hice promesa sorry -K
    public static getPartidosList(ids:string[]):Promise<any> 
    {
        return new Promise(async(resolve, reject) => {
            let output: any[] = [];             
            let promises:Promise<any>[] = [];   // threadpool
            
            ids.forEach(id => promises.push(partidoModel.findById(id)));
            
            await Promise.all(promises)
            .then(data => output.push(data))
            .catch(err => reject(err));

            resolve(output);
        })
    }
}