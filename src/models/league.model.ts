import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import { Team } from "./team.model";
import { Country } from "./country.model";


@modelOptions({
    schemaOptions: { collection: "paises" }
})

export class League {
    @prop({required: true}) 
    nombre!:    string;

    @prop({required: true})
    pais!:      Country;

    @prop({required: true}) 
    equipos!:   Array<Team>;

}

export const leagueModel = getModelForClass(League);