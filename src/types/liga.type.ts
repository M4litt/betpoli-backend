import { Equipo } from "../models/equipo.model";
import { Pais } from "../models/pais.model";

export interface ILiga 
{
    nombre:    string;
    escudo:    string;
    pais:      Pais;
    equipos:   Array<Equipo>;
}