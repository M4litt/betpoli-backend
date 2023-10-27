import { Request, Response } from "express";
import { eventModel } from "../models/event.model";
import { matchModel } from "../models/match.model";
import mongoose, { ObjectId } from "mongoose";
import { verify } from "crypto";
import { periodistaModel } from "../models/periodista.model";

/*
    getGlobalEvents: Terminado. 200 y 404
    getMatchEvents: Terminado 200 y 404
    createEvent: Terminado. 201, 409 y 500.
    nullifyEvent: Terminado. 200, 404 y 500.
    patchEvent: Terminado. 200, 404, 409 y 500.
    deleteEvent: Terminado. 204, 404 y 500.
*/


export default {
    placeholder: (req: Request, res: Response) => {
        return res.status(200).send('Response from event.controller')
    },

    getGlobalEvents: async (req: Request, res: Response) => {
        
        try {
            const globalEvents = await eventModel.find();

            if (!globalEvents) {
                return res.status(404).send('No se encontraron eventos');
            }

            return res.status(200).send(globalEvents);

        } catch (error) {
            console.error("Error al buscar eventos");
            return res.status(500).send("Ocurrio un error al buscar eventos");
        }
    },

    getMatchEvents: async (req: Request, res: Response) => {

        try {
            const matchEvents = await eventModel.find({idPartido:req.params.idPartido});
            
            if (!matchEvents) {
                return res.status(404).send('No se encontraron eventos');
            }

            return res.status(200).send(matchEvents);

        } catch (error) {
            console.error("Error buscando eventos");
            return res.status(500).send("Ocurrio un error al buscar eventos");
        }
    },

    createEvent: async (req: Request, res: Response) => {
        const timestampInMilis  = new Date().getTime();
        try {
            const existingPartido = await matchModel.findById(req.body.idPartido);
            if (!existingPartido) {
                return res.status(404).send('Partido no encontrado');
            }
            
            else {
                const existingEvent = await eventModel.findOne({
                    idPartido:req.body.idPartido,
                    timestamp:timestampInMilis
                });

                if (existingEvent) {
                    return res.status(409).send('Conflicto: El evento ya existe');
                }

                if (existingPartido.estado == 'MATCH_OVER') {
                    return res.status(409).send('Conflicto: El partido ya termino');
                }

                else{
                    
                    const result = checkBody(req.body);

                    if (result != 0) {
                        res.status(400).send('Invalid body: '+result+' is not valid');
                        return;
                    }
                    
                    req.body.timestamp = timestampInMilis;
                    req.body.fueAnulado = false;

                    const periodista = await periodistaModel.findOne(res.locals.decodedJWT);
                    const objectIdStr = periodista!._id.toString();
                    req.body.idPeriodista = objectIdStr;
                    
                    const newEvent = await eventModel.create(req.body);
                    if(newEvent.nombre == 'gol'){
                        addGoals(newEvent);
                    }
                    
                    return res.status(201).send(newEvent);
                } 
            }
        } catch (error) {
            console.error("Error al crear el evento", error);
            return res.status(500).send("Ocurrio un error al crear el evento");
        } 

    },

    nullifyEvent: async (req: Request, res: Response) => {

        try {
            const nullifiedEvent = await eventModel.findOneAndUpdate(            
                {   
                    idPartido:req.params.idPartido,
                    timestamp:req.params.timestamp
                },
                {
                    fueAnulado: true
                });
                
            if (!nullifiedEvent) {
                return res.status(404).send('Evento no encontrado');
            }

            if (nullifiedEvent.fueAnulado) {
                return res.status(409).send('El evento ya fue anulado');
            }

            if(nullifiedEvent.nombre == 'gol'){
                subtractGoals(nullifiedEvent);
            }

            return res.status(200).send(nullifiedEvent);

        } catch (error) {
            console.error("Error al anular el evento");
            return res.status(500).send("Ocurrio un error al anular el evento");
        }
    },

    deleteEvent: async (req: Request, res: Response) => {
        try {
            const deletedEvent = await eventModel.findOneAndDelete(
                {
                    idPartido:req.params.idPartido,
                    timestamp:req.params.timestamp 
                }
            );

            if (!deletedEvent) {
                return res.status(404).send('Evento no encontrado');
            }

            if(deletedEvent.nombre=='gol'&& !deletedEvent.fueAnulado)
                subtractGoals(deletedEvent);

            return res.status(204).send(deletedEvent);

        } catch (error) {
            console.error("Error al borrar el evento");
            return res.status(500).send("Ocurrio un error al borrar el evento");
        }

    }

}

function checkBody(requestBody: any){
    const expectedBody = {
        idPartido: '',
        nombre: '',
        equipo: '',
        minutos_totales: 0,
        minutos_parciales: 0,
    }
    
    for (const key in requestBody) {
        if (expectedBody.hasOwnProperty(key)) {
            const element = requestBody[key];
            if (element === undefined || typeof element != typeof expectedBody[key as keyof object]) {
                //res.status(400).send('Invalid body: '+ key + ' is not valid');
                return key;
            }
        }
    }
    return 0;
}

async function addGoals(goalEvent: any){
    if(goalEvent.equipo == 'LOCAL'){
        await matchModel.findByIdAndUpdate(
            goalEvent.idPartido,
            {$inc: { gol_local: 1 }},
            {new: true}
        )
    }
    else{   
        await matchModel.findByIdAndUpdate(
            goalEvent.idPartido,
            {$inc: { gol_visitante: 1 }},
            {new: true}
        )
    }

}

async function subtractGoals(nullifiedEvent: any){
    if(nullifiedEvent.equipo == 'LOCAL'){
        await matchModel.findByIdAndUpdate(
            nullifiedEvent.idPartido,
            {$inc: { gol_local: -1 }},
            {new: true}
        )
    }
    else{   
        await matchModel.findByIdAndUpdate(
            nullifiedEvent.idPartido,
            {$inc: { gol_visitante: -1 }},
            {new: true}
        )
    }
}



    /* patchEvent: async (req: Request, res: Response) => {
        const requestBody = req.body;
        const expectedBody = {
            idPartido: '',
            name: '',
            team: '',
            timestamp: 0,
            minutes_total: 0,
            match_state: '',
            minutes_partial: 0,
            wasNullified: false
        }

        for (const key in requestBody) {
            if (expectedBody.hasOwnProperty(key)) {
                const element = requestBody[key];
                if (element === undefined || typeof element != typeof expectedBody[key as keyof object]) {
                    return res.status(400).send('Invalid body');
                }
            }
        }

        try {
            const patchedEvent = await eventModel.findOneAndUpdate(
                {
                    idPartido:req.params.idPartido,
                    timestamp:req.params.timestamp 
                },
                req.body
            );
            
            if (!patchedEvent) {
                return res.status(404).send('Event not found');
            }

            res.status(200).send(patchedEvent);
        
        } catch (error) {
            console.error("Error updating the event");
            return res.status(500).send("An error ocurred while updating the event");
        }

    }, */