import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({
    schemaOptions: { collection: "equipos" }
})
class Equipo {
    @prop({required: true}) 
    nombre!:        string;
    
    @prop({required: true}) 
    local!:         string;
    
    @prop({required: true}) 
    visitante!:     string;
    
    @prop({required: true}) 
    gol_local!:     number;
    
    @prop({required: true}) 
    gol_visitante!: number;
    
    @prop({required: true}) 
    estado!:        string;
    
    @prop({required: true}) 
    fecha!:         string;
    
    @prop({required: true}) 
    escudo!:        string;
    
}

export const equipoModel = getModelForClass(Equipo);