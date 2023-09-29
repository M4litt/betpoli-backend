import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import dotenv from 'dotenv'
import { rutasUsuarios } from "./routes/user.routes";
import { sha256 } from "./controllers/Apostador.controller";
import { rutasApuestas } from "./routes/apuesta.routes";
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from "./swagger.json"
import cors from "cors"

const app = express();
const puerto = 3000;
dotenv.config()

console.log(sha256("123"))

app.get("", (req, res) => res.send("Bienvenido a mi api"));

app.listen(puerto, () => console.log("Escuchando en el puerto: " + puerto));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors())
app.use("/apuestas", bodyParser.json(),rutasApuestas)
app.use("/usuarios", bodyParser.json(),rutasUsuarios);

mongoose
    .set("strictQuery",  false)
    .connect(process.env.MONGO_CON_STRING!).then(() => {
        console.log(`mongoDB connection initialized.`)
    })