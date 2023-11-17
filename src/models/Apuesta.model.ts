import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {"collection": "Apuesta"}
})
class Apuesta 
{
    @prop({required: true})
    idPartido!: String

    @prop({required: true})
    golesVisitante!: Number

    @prop({required: true})
    golesLocal!: Number

    @prop({required: true})
    monto!: Number

    @prop({required: true})
    mailUsuario!: String

    @prop({required: true})
    estado!: String
}

export const apuestaModel = getModelForClass(Apuesta)