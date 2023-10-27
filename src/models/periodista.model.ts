import { getModelForClass, modelOptions, mongoose, prop } from "@typegoose/typegoose"

@modelOptions({
    schemaOptions: { collection: "periodistas" }
})
class Periodista {
    @prop({ required: true })
    nombre: string = '';

    @prop({ required: true })
    apellido: string = '';

    @prop({ required: true })
    password: string = '';

    @prop({ required: true })
    domicilio: string = '';

    @prop({ required: true })
    fecha_de_nac: string = '';

    @prop({ required: true })
    documento: string = '';

    @prop({ required: true })
    mail: string = '';

    @prop({ required: true })
    telefono: string = '';

    @prop({ required: true })
    empresa_perteneciente: string = '';

    // por esto de aca saltan los mensajes del principio
    // allowmixed no existe como propiedad (o por lo menos no aparece)
    // intente todo para q no salte pero nose
    @prop({ required: false })
    partidos: string[] = [];
};

export const periodistaModel = getModelForClass(Periodista);
