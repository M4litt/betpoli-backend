import fileUpload            from 'express-fileupload';
import mongoose              from 'mongoose';
import { Request, Response } from 'express';
import { periodistaModel }   from '../models/periodista.model';
import { equipoModel }       from '../models/equipo.model';
import { ligaModel }         from '../models/liga.model';
import { paisModel }         from '../models/pais.model';

// la estructura es: /.public/<carpeta>/<id>.<file-extension>

export async function uploadFile(req:Request, res:Response)
{
    const folder:string = req.params.foldername;
    const id    :string = req.params.id;

    const image = req.files?.image as fileUpload.UploadedFile;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("Id no válido.");
    if (!image)                               return res.status(400).json('Imagen no encontrada');
    
    // set filename to <id>.<file-extension>
    image.name = `${id}.${image.name.split('.').filter(Boolean).slice(1).join('.')}`;

    const route = `${__dirname}/../../.public/${folder}/${image.name}`;
    
    image.mv(route)
    .then(() => 
    {
        // after image is successfully loaded, update route in database
        const successMsg = `Imagen subida correctamente y ruta establecida como ${route}`;

        switch (folder) {
            case "periodista":
                periodistaModel.findByIdAndUpdate(id, { documento: route })
                .then(()   => res.status(200).send(successMsg))
                .catch(err => res.status(500).json(err));
                break;
    
            case "equipo":
                equipoModel.findByIdAndUpdate(id, { escudo: route })
                .then(()   => res.status(200).send(successMsg))
                .catch(err => res.status(500).json(err));
                break;
         
            case "liga":
                ligaModel.findByIdAndUpdate(id, { escudo: route })
                .then(()   => res.status(200).send(successMsg))
                .catch(err => res.status(500).json(err));
                break;
    
            case "pais":
                paisModel.findByIdAndUpdate(id, { bandera: route })
                .then(()   => res.status(200).send(successMsg))
                .catch(err => res.status(500).json(err));
                break;
    
            default:
                return res.status(400).json(`Directorio /upload/${folder} no encontrado.`);
                break;
        }
    })
    .catch(err => res.status(500).send(`Error interno del servidor: ${err}`));
}
