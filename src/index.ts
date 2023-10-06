//* Deps
import express from "express"
import dotenv from "dotenv";
import mongoose from "mongoose";

//* Routers
import { matchRouter } from "./routes/match.routes";

import swaggerUi = require('swagger-ui-express');
import fs from "fs";

dotenv.config()

const app = express()

const swaggerFile = (process.cwd()+"/swagger.json");
const swaggerData = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);

app
    .use(express.json())
    .use('/matches', matchRouter)
    .get('/', (req, res) => {
        res.status(200).send('Conection stablished!')
    })
    .use('/matches/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, undefined, undefined, undefined))
    .listen(process.env.API_PORT, () => {
        console.log(`API service on: http://localhost:${process.env.API_PORT}`)
    })

mongoose
    .set("strictQuery", false)
    .connect(process.env.DB_CON_STR!).then(() => {
        console.log(`mongoDB connection initialized.`)
    })
