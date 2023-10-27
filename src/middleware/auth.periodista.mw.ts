import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { periodistaModel } from "../models/periodista.model";

export async function auth(req:Request, res:Response, next:NextFunction) {
    
    const token = req.headers['authorization'];

    if (!token) {
        res.status(404).send('Token not found'); 
        return;
    }

    try {

        const decoded = jwt.verify(
            token!, 
            process.env.JWT_PERIODISTA_SECRET || 'invalid-periodista-key'
        );

        const payload = parseJwt(token)

        if(!payload || !payload.mail) {
            res.status(400).send('Bad token');
            return
        }

        periodistaModel.findOne({mail: payload.mail}).then(data => {
            if(!data) {
                res.status(401).send('Unauthorized periodista token');
            } else {
                res.locals.decodedJWT = data;
                next();
            }
        })
        
    } 
    catch (err) {

        res.status(401).send('Unauthorized periodista token');
        
    }
}

function parseJwt (token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}