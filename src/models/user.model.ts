import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {"collection": "usuarios"}
})
class User {
    @prop({required: true})
    fullName!: string

    @prop({required: true})
    dni!: string

    @prop({required: true})
    email!: string

    @prop({required: true})
    passwd!: string
}

export const userModel = getModelForClass(User)
