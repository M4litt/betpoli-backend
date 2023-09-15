import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {"collection": "Apuesta"}
})
class Apuesta {
    @prop({required: true})
    idPartido!: String

    @prop({required: true})
    resultado!: String

    @prop({required: true})
    monto!: number
}

export const apuestaModel = getModelForClass(Apuesta)