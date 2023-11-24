import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({
    schemaOptions: { collection: "equipos" }
})
export class Team {
    @prop({required: true}) 
    nombre!:        string;

    @prop({required: true}) 
    escudo!:        string;
}

export const teamModel = getModelForClass(Team);