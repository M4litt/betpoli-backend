import { isValidObjectId } from "mongoose"
import { apuestaModel } from "../models/Apuesta.model"
import { urlApiPartidos } from "./Apostador.controller"
import { partidoModel } from "../models/partido.model"

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

        partidoModel.findOne({_id: req.params}).then((b) => {
            if(b == undefined){
                return res.status(400).send("partido no encontrado")
            }
            if(b.estado != "match_over"){
                return res.status(400).send("partido no terminado");
            }
            const diferencia = b.gol_local - b.gol_visitante;
            apuestaModel.updateMany({_id: req.params.idPartido}, {$set: {estado: "perdida"}}).then((v) => {
                if(diferencia == 0){
                    apuestaModel.updateMany({_id: req.params.idPartido, $expr: {$eq: ["$gol_local", "$gol_visitante"]}}, 
                    {$set: {estado: "ganada"}}).then((n) => {
                        res.status(200).send("apuestas cerradas correctamente")
                        return
                    })
                }
                else if(diferencia < 0){
                    apuestaModel.updateMany({_id: req.params.idPartido, gol_visitante: {$gt: "$gol_local"}}, 
                    {$set: {estado: "ganada"}}).then((n) => {
                        res.status(200).send("apuestas cerradas correctamente")
                        return
                    })
                }
                else{
                    apuestaModel.updateMany({_id: req.params.idPartido, gol_local: {$gt: "$gol_visitante"}}, 
                    {$set: {estado: "ganada"}}).then((n) => {
                        res.status(200).send("apuestas cerradas correctamente")
                        return
                    })
                }
            })
        })
    }
}