import { matchModel } from "../models/match.model";
import { teamModel } from "../models/team.model";
import { Team } from "../models/team.model";
import { Match } from "../models/match.model";

const generarObjetoProbabilidad = async (equipo: string) => {
    console.log(process.env.DB_CON_STR)
    const partidos = await matchModel.find({$or: [{local: equipo}, {visitante: equipo}], estado: "match_over"})
    // gep: ganados, empatados, perdidos
    console.log(partidos)
    const gepArray = partidos.map((partido) => {
        if (partido.local == equipo){
            if (partido.gol_local > partido.gol_visitante) return "g";
            else if (partido.gol_local < partido.gol_visitante) return "p";
            else return "e";
        } else {
            if (partido.gol_local < partido.gol_visitante) return "g";
            else if (partido.gol_local > partido.gol_visitante) return "p";
            else return "e";
        }
    })
    let ganadosLocal = 0;
    let empatadosLocal = 0;
    for(let i = 0; i < gepArray.length; i++){
        if (gepArray[i]=="g") ganadosLocal++;
        else if (gepArray[i]=="e") empatadosLocal++;
    }
    const objetoProbabilidad = {
        ganados: ganadosLocal,
        empatados: empatadosLocal,
        perdidos: gepArray.length - ganadosLocal - empatadosLocal
    }
    return objetoProbabilidad;
}

export default generarObjetoProbabilidad;