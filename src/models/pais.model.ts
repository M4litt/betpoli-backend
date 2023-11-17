import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({
    schemaOptions: { collection: "paises" }
})

export class Pais 
{    
    @prop({required: true}) 
    nombre!:        string;

    @prop({required: true})
    codigoPais!:    string;

    @prop({required: true}) 
    bandera!:       string;

}

export const paisModel = getModelForClass(Pais);