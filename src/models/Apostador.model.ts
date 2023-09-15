import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {"collection": "Apostador"}
})
class Apostador {
    @prop({required: true})
    nombre!: String

    @prop({required: true})
    apellido!: String

    @prop({required: true})
    DNI!: String

    @prop({required: true})
    fechaNac!: Date

    @prop({required: true})
    fotoDoc!: String

    @prop({required: true})
    mail!: String

    @prop({required: true})
    contraseña!: String

    @prop({required: true})
    estado!: String
}

export const apostadorModel = getModelForClass(Apostador)