import { ModelOptions, getModelForClass, prop } from "@typegoose/typegoose";

@ModelOptions(
    { schemaOptions: { collection: "admin" } }
)
export class Admin 
{
    @prop({ required: true })
    nombre: string = '';

    @prop({ required: true })
    password: string = '';
}

export const adminModel = getModelForClass(Admin);