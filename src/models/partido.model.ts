import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Liga } from "./liga.model";

@modelOptions({
    schemaOptions: { collection: "partidos" }
})
export class Partido 
{
    @prop({required: true}) 
    local!:         string;

    @prop({required: true}) 
    visitante!:     string;

    @prop({required: true}) 
    gol_local!:     number;

    @prop({required: true}) 
    gol_visitante!: number;

    @prop({required: true}) 
    estado!:        string;

    @prop({required: true}) 
    fecha!:         string;

    @prop({required: true}) 
    liga!:          Liga;
}

export const partidoModel = getModelForClass(Partido)
