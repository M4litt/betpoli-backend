import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import { Team } from "../models/team.model";
import { Pais } from "./pais.model";


@modelOptions({
    schemaOptions: { collection: "ligas" }
})
export class Liga {
    @prop({required: true})
    nombre!:    string;

    @prop({required: true})
    pais!:      Pais;

    @prop({required: true})
    equipos!:   Array<Team>;

    @prop({required: true})
    escudo!:    string;
}

export const ligaModel = getModelForClass(Liga);