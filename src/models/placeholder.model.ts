//! Archivo solo de prueba, editar/borrar en sus branches
//* Deps
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {"collection": "placeholder"}
})
class placeholder {
    @prop({required: true})
    test!: string
}

export const placeholderModel = getModelForClass(placeholder)