import matchStates from "./constants/matchStates";

const createMatch = (
    local: string, 
    visitante: string, 
    fecha: Date, 
    gol_local: number = 0, 
    gol_visitante: number = 0,
    estado: matchStates = matchStates.DEFAULT
) => {
    return {
        local,
        visitante,
        fecha,
        gol_local: 0,
        gol_visitante: 0,
        estado: matchStates.DEFAULT,
    }
}

export default createMatch;