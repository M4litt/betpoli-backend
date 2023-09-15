import jwt from "jsonwebtoken";

export function generarClave(nombre: String): string{
    let dataFirma = {
        "nombre": nombre
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
        const nombreGenerado: string = payload.nombre;

        const nombreSolicitud: string = req.body.nombreUsuario;

        if (nombreGenerado !== nombreSolicitud) {
            return res.status(401).send('Unauthorized: Invalid token.');
        }
        next();
    }
    catch (err) {
        return res.status(401).send('Unauthorized: Invalid token.');
    }
}