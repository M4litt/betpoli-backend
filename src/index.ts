import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'

// routes
import { rutasUsuarios } from "./routes/user.routes";
import { PeriodistaRouter } from "./routes/periodista.routes";
import { equipoRouter } from "./routes/equipo.routes";
import { AdminRouter } from "./routes/admin.routes";
import { partidoRouter } from "./routes/partido.routes";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors(
        { 
            origin: [`http://localhost:${PORT}`, `http://localhost:3000`], 
        }
    )
);

app.get("", (req, res) => res.send("Bienvenido a mi api"));

app.listen(PORT, () => console.log(`> BetPoeli deployed on http://localhost:${PORT}`));

app.use(bodyParser.json());
app.use('/usuarios',    rutasUsuarios);
app.use('/periodistas', PeriodistaRouter);
app.use('/equipos',     equipoRouter);
app.use('/admin',       AdminRouter);
app.use('/partidos',    partidoRouter)

mongoose
.set("strictQuery",  false)
.connect(process.env.MONGO_CON_STRING!)
.then(() => console.log(`> mongoDB connection initialized.`))
=======
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
