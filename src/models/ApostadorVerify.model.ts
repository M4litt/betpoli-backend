import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {"collection": "ApostadorVerify"}
})
class ApostadorVerify 
{
    @prop({required: true})
    mail!: string

    @prop({required: true})
    otp!: string
}
export const apostadorVerify = getModelForClass(ApostadorVerify);