import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import dotenv from 'dotenv'
import { rutasUsuarios } from "./routes/user.routes";
import { PeriodistaRouter } from "./routes/periodista.routes";

const app = express();
const PORT = 3000;
dotenv.config()

app.get("", (req, res) => res.send("Bienvenido a mi api"));

app.listen(PORT, () => console.log(`BetPoeli deployed on http://localhost:${PORT}`));

app.use("/usuarios", bodyParser.json(), rutasUsuarios);
app.use("/periodistas", bodyParser.json(), PeriodistaRouter);


mongoose
    .set("strictQuery",  false)
    .connect(process.env.MONGO_CON_STRING!).then(() => {
        console.log(`mongoDB connection initialized.`)
    })