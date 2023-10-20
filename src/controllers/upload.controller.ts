import { Request, Response } from "express";
import fileUpload from "express-fileupload";

export function uploadFile(req:Request, res:Response)
{
    const folder:string = req.params.foldername;

    if (folder != ["periodista","equipo","partido","liga","pais"].find(f => f == folder)) 
        return res.status(400).json("Directorio /.upload/" + folder + " no encontrado.");

    const image = req.files?.image as fileUpload.UploadedFile;

    if (!image) return res.status(400).json('Imagen no encontrada');

    image.mv(`${__dirname}/../../.public/${folder}/${image.name}`)
    .then(()   => res.status(200).send('Imagen subida correctamente'))
    .catch(err => res.status(500).send(`Error interno del servidor: ${err}`));
}