import jwt from "jsonwebtoken";

import { apostadorModel } from "../models/Apostador.model";

export function generarClave(mail: String): string{
    let dataFirma = {
        "mail": mail
    }
    let respuesta = jwt.sign(dataFirma, process.env.JWT_SECRET!, {expiresIn:'1d'});

    return respuesta;
}

export function verificarClave(req: any, res: any, next: any){
    const clave = req.headers.authorization;

    if (clave == undefined) {
        return res.status(401).send('Unauthorized: No token provided.');
    }

    try {
        const payload: any = jwt.verify(clave, process.env.JWT_SECRET!);

        
        apostadorModel.findOne({mail: payload.mail}).then((v) => {
            if(v){
                next();
            }
            else{
                return res.status(401).send('Unauthorized: Invalid token.');
            }
        })
    }
    catch (err) {
        return res.status(401).send('Unauthorized: Invalid token.');
    }
}