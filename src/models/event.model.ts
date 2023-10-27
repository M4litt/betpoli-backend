import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import matchStates from "../utils/constants/matchStates";
import { ObjectId } from "mongoose";

@modelOptions({
    schemaOptions: {"collection": "eventos"}
})
class Event {
    @prop({required: true})
    idPartido!: ObjectId // Id del partido en el que sucede el evento.

    @prop({required: true})
    nombre!: string // Nombre del evento, ejemplo: 'goal'.

    @prop({required: true})
    equipo!: string // "Autor" del evento, LOCAL/VISITANTE.

    @prop({required: true})
    timestamp!: number // Sello del evento.

    @prop({required: true})
    minutos_totales!: number // Total del evento transcurso del evento.

    @prop({required: true})
    minutos_parciales!: number // Tiempo parcial en el transcurso del evento (fh o sh).

    @prop({required: true})
    fueAnulado!: boolean // Ver si el evento fue anulado

    @prop({required:true})
    idPeriodista!: ObjectId // Id del periodista que crea el evento

}

export const eventModel = getModelForClass(Event)
