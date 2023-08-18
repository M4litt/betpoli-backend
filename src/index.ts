import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import dotenv from 'dotenv'
import { rutasUsuarios } from "./routes/user.routes";

const app = express();
const puerto = 3000;
dotenv.config()

app.get("", (req, res) => res.send("Bienvenido a mi api"));

app.listen(puerto, () => console.log("Escuchando en el puerto: " + puerto));

app.use("/usuarios", bodyParser.json(),rutasUsuarios);

mongoose
    .set("strictQuery",  false)
    .connect(process.env.MONGO_CON_STRING!).then(() => {
        console.log(`mongoDB connection initialized.`)
    })