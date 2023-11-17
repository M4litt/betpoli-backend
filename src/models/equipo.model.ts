import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({
    schemaOptions: { collection: "equipos" }
})
export class Equipo 
{
    @prop({required: true}) 
    nombre!:        string;

    @prop({required: true}) 
    escudo!:        string;

    @prop({required: true})
    jugadores!:     Array<string>;

}

export const equipoModel = getModelForClass(Equipo);
