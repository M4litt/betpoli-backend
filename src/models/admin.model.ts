import { ModelOptions, getModelForClass, prop } from "@typegoose/typegoose";

@ModelOptions(
    { schemaOptions: { collection: "admin" } }
)
class Admin 
{
    @prop({ required: true })
    nombre: string = '';

    @prop({ required: true })
    password: string = '';
}

export const adminModel = getModelForClass(Admin);