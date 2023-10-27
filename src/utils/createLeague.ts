import { Team } from "../models/team.model";
import { Country } from "../models/country.model";
const createLeague = (
    nombre: string,
    pais: Country,
    equipos: Array<Team> = []
) => {
    return {
        nombre,
        pais,
        equipos,
    }
}

export default createLeague;