import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({ 
    schemaOptions: { collection: "periodistas" } 
})
class Periodista {
    @prop({ required: true })
    nombre:                string = '';

    @prop({ required: true })
    apellido:              string = '';

    @prop({ required: true })
    password:              string = '';

    @prop({ required: true })
    domicilio:             string = '';

    @prop({ required: true })
    fecha_de_nac:          string = '';

    @prop({ required: true })
    documento:             string = '';

    @prop({ required: true })
    mail:                  string = '';

    @prop({ required: true })
    telefono:              string = '';

    @prop({ required: true })
    empresa_perteneciente: string = '';
};

export const periodistaModel = getModelForClass(Periodista)