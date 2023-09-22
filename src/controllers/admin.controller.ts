import { adminModel } from "../models/admin.model";
import { Request, Response } from "express";
import { createHash } from 'node:crypto';
import { IAdmin } from "../types/admin.type";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AdminController 
{
    public static getAll(req: Request, res: Response) 
    {
        adminModel.find()
        .then((admins) => res.status(200).json(admins))
        .catch((err) => res.status(400).json(err));
    }

    public static register(req:Request, res:Response)
    {
        const admin:IAdmin = req.body;
        
        // check if already exists/name is taken
        adminModel.findOne({ nombre: admin.nombre })
        .then((exists) => {
            
            if (exists)
            {
                res.status(400).json({ error: "Admin already exists" });
                return;
            }
            
            // hash password
            admin.password = AdminController.sha256(admin.password);

            // create admin
            adminModel.create(admin)
            .then((admin) => res.status(200).json(admin))
            .catch((err) => res.status(400).json(err))
        })
        .catch((err) => res.status(400).json(err));
        
    }

    public static login(req:Request, res:Response)
    {
        const in_admin:IAdmin = req.body;

        adminModel.findOne({ nombre: in_admin.nombre })
        .then((admin) => {
            
            // if admin is null
            if (!admin) 
            {
                res.status(400).json({ error: "Admin not found" });
                return;
            }

            // check that password matches
            if (admin.password != AdminController.sha256(in_admin.password)) 
            {
                res.status(400).json({ error: "Wrong password" });
                return;
            }

            // return token
            res.status(200).json(AdminController.getToken(in_admin));
        })
        .catch((err) => res.status(400).json(err));
    }

    private static sha256(content: string) {  
        return createHash('sha256').update(content).digest('hex')
    }

    private static getToken(user:IAdmin): string {
        return jwt.sign(
            user,
            process.env.JWT_ADMIN_SECRET || '',
            { 
                expiresIn: '5h' 
            }
        );
    }

    public static delete(req:Request, res:Response) 
    {
        const id = req.params.id;
        adminModel.findByIdAndDelete(id)
        .then((admin) => res.status(200).json(admin))
        .catch((err) => res.status(400).json(err));
    }

    public static getOne(req:Request, res:Response)
    {
        const id = req.params.id;
        adminModel.findById(id)
        .then((admin) => res.status(200).json(admin))
        .catch((err) => res.status(400).json(err));
    }
}