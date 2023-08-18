import express from "express";
import { rutasUsuarios } from "./Rutas/rutasUsuarios";
import bodyParser from 'body-parser';
import mongoose from "mongoose";

const app = express();

const puerto = 3000;

app.get("", (req, res) => res.send("Bienvenido a mi api"));

app.listen(puerto, () => console.log("Escuchando en el puerto: " + puerto));

app.use("/usuarios", bodyParser.json(),rutasUsuarios);

mongoose
    .set("strictQuery",  false)
    .connect("mongodb://localhost:27017/Apuestas").then(() => {
        console.log(`mongoDB connection initialized.`)
    })