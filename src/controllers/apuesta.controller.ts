import { isValidObjectId } from "mongoose"
import { apuestaModel } from "../models/apuesta.model"
import { urlApiPartidos } from "./apostador.controller"

export default {
    cerrarApuestas(req: any, res: any) {
        if (!req.params.idPartido) {
            res.status(400).send("no se enviaron todos los datos")
            return
        }

        if (!isValidObjectId(req.params.idPartido)) {
            res.status(400).send("id de partido invalida")
            return
        }

        fetch(urlApiPartidos + "/matches/single/" + req.params.idPartido, { method: "GET" })
            .then((v) => v.json())
            .then((b) => {
                if(b.estado == "match_over"){
                    const golVisitante: String = b.gol_visitante;
                    const golLocal: String = b.gol_local;

                    apuestaModel.updateMany({
                           $or: [
                              {golesLocal: { $ne: golLocal}},
                              {golesVisitante: { $ne: golVisitante}}
                           ]
                        },{$set: { estado: "perdida" }}).then((b) => {
                            apuestaModel.updateMany({golesLocal: golLocal, golesVisitante: golVisitante}, 
                                {$set: { estado: "ganada" }}).then((c) => {
                                    res.status(200).send("apuestas cerradas correctamente")
                                    return
                                })
                        })
                }
                else{
                    res.status(400).send("el partido no termino")
                }
            })
            .catch((err: any) => {
                console.error('error: ' + err)
                res.status(400).send("Partido inexistente")
            });
    }
}