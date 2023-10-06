export class Partido {
    local:         string = '';
    visitante:     string = '';
    gol_local:     number = 0;
    gol_visitante: number = 0;
    estado:        string = '';
    fecha:         string = '';
}

export interface IPartido {
    local:         string;
    visitante:     string;
    gol_local:     number;
    gol_visitante: number;
    estado:        string;
    fecha:         string;
}
/*
"local": "",
"visitante"   : "",
"gol_local": ,
"gol_visitante": ,
"estado": "",
"fecha": ""
*/