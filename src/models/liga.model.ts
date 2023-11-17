import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import { Equipo } from "../models/equipo.model";
import { Pais } from "./pais.model";


@modelOptions({
    schemaOptions: { collection: "ligas" }
})
export class Liga 
{
    @prop({required: true})
    nombre!:    string;

    @prop({required: true})
    pais!:      Pais;

    @prop({required: true})
    equipos!:   Array<Equipo>;

    @prop({required: true})
    escudo!:    string;

}

export const ligaModel = getModelForClass(Liga);