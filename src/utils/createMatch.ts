import { Team } from "../models/team.model";
import matchStates from "./constants/matchStates";

const createMatch = (
    local: Team, 
    visitante: Team, 
    fecha: Date, 
    gol_local: number = 0, 
    gol_visitante: number = 0,
    estado: matchStates = matchStates.DEFAULT
) => {
    return {
        local,
        visitante,
        fecha,
        gol_local: gol_local,
        gol_visitante: gol_visitante,
        estado: estado,
    }
}

export default createMatch;