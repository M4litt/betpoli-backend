import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
    
})
export class Jugador 
{
    @prop({ required: true})
    nombre!:string;

    @prop({ required: true})
    apellido!:string;

    @prop({ required: true})
    edad!:number;

    @prop({ required: true})
    dorsal!:number;

    @prop({ required: true})
    posicion!:string;

    @prop({ required: true})
    promedio!:number;

    @prop({ required: true})
    asistencias!:number;

    @prop({ required: true})
    goles!:number;

}

export const jugadorModel = getModelForClass(Jugador);