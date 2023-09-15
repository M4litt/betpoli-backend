import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export async function auth(req:Request, res:Response, next:NextFunction) {
    
    const token = req.headers['authorization'];
    
    if (!token) {
        res.status(404).send('Token not found'); 
        return;
    }

    try {

        const decoded = jwt.verify(
            token!, 
            process.env.JWT_APOSTADOR_SECRET || 'invalid-apostador-key'
        );

        next();
        
    } catch (err) {

        res.status(401).send('Unauthorized apostador token');
        
    }
}