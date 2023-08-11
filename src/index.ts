//* Deps
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

//* Routers
//? Agregar routers
//? import placeholderRouter from './routes/placeholder.routes.ts';

//* Setup
const app = express()
dotenv.config()

//! Guardar y acceder a cosas como direcciones IP, claves, etc, desde '.env'
app
    .use(express.json())
    .listen(process.env.API_PORT, () => {
        console.log(`API service on: http://localhost:${process.env.API_PORT}`)
    })

mongoose
    .set("strictQuery", false)
    .connect(process.env.DB_CON_STR!).then(() => {
        console.log(`mongoDB connection initialized.`)
    })
