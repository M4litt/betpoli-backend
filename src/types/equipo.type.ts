export class Equipo {
    nombre:         string = '';
    local:          string = '';
    visitante:      string = '';
    gol_local:      number = 0;
    gol_visitante:  number = 0;
    estado:         string = '';
    fecha:          string = '';
    escudo:         string = '';
}

export interface IEquipo {
    nombre:         string;
    local:          string;
    visitante:      string;
    gol_local:      number;
    gol_visitante:  number;
    estado:         string;
    fecha:          string;
    escudo:         string;
}