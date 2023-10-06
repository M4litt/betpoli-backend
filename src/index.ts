import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from "./swagger.json"

// routes
import { rutasUsuarios } from "./routes/user.routes";
import { PeriodistaRouter } from "./routes/periodista.routes";
import { equipoRouter } from "./routes/equipo.routes";
import { AdminRouter } from "./routes/admin.routes";
import { partidoRouter } from "./routes/partido.routes";
import { rutasApuestas } from './routes/apuesta.routes';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: [`http://localhost:${PORT}`, `http://localhost:3000`], }));

app.listen(PORT, () => console.log(`> BetPoeli deployed on http://localhost:${PORT}`));

app
.use(bodyParser.json())
.get('', (req, res) => res.send("Bienvenido a mi api"))
.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
.use("/apuestas",    rutasApuestas)
.use("/usuarios",    rutasUsuarios)
.use('/usuarios',    rutasUsuarios)
.use('/periodistas', PeriodistaRouter)
.use('/equipos',     equipoRouter)
.use('/admin',       AdminRouter)
.use('/partidos',    partidoRouter)

mongoose
.set("strictQuery",  false)
.connect(process.env.MONGO_CON_STRING!)
.then(() => console.log(`> mongoDB connection initialized.`))
