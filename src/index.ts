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