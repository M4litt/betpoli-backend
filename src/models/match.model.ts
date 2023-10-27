import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import matchStates from "../utils/constants/matchStates";

@modelOptions({
    schemaOptions: {"collection": "partidos"}
})
class Match {
    @prop({required: true})
    local!: string

    @prop({required: true})
    visitante!: string

    @prop({required: true})
    gol_local!: number

    @prop({required: true})
    gol_visitante!: number

    @prop({required: true})
    estado!: matchStates

    @prop({required: true})
    fecha!: Date

    @prop({required: true})
    id!: string
}

export const matchModel = getModelForClass(Match)
