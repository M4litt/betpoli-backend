// * Deps
import express, { Request, Response } from 'express';
import * as swaggerDocument           from './swagger.json'
import fileUpload                     from 'express-fileupload';
import swaggerUi                      from 'swagger-ui-express'
import bodyParser                     from 'body-parser';
import mongoose                       from "mongoose";
import dotenv                         from 'dotenv'
import cors                           from 'cors'

// * Routers
import { PeriodistaRouter }           from './routes/periodista.routes';
import { partidoRouter }              from './routes/partido.routes';
import { rutasApuestas }              from './routes/apuesta.routes';
import { equipoRouter }               from './routes/equipo.routes';
import { AdminRouter }                from './routes/admin.routes';
import { rutasUsuarios }              from './routes/user.routes';
import { ligaRouter }                 from './routes/liga.routes';
import { paisRouter }                 from './routes/pais.routes';
import { uploadFile }                 from './controllers/upload.controller';
import { jugadorRouter } from './routes/jugador.routes';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// hay conflictos entre los swaggers
/*
import fs                             from "fs"
const swaggerFile = (process.cwd()+"/swagger.json")
const swaggerData = fs.readFileSync(swaggerFile, 'utf8')
const swaggerDocument = JSON.parse(swaggerData)
app
.use('/partidos/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, undefined, undefined, undefined))
*/

app
.use(cors({ origin: [`http://localhost:${PORT}`, `http://localhost:3000`], }))
.use(bodyParser.json())

// routes
.get('/', (req:Request, res:Response) => res.send("Bienvenido a mi api"))
.use('/api-docs',    swaggerUi.serve, swaggerUi.setup(swaggerDocument))
.use("/apuestas",    rutasApuestas)
.use('/usuarios',    rutasUsuarios)
.use('/periodistas', PeriodistaRouter)
.use('/equipos',     equipoRouter)
.use('/admin',       AdminRouter)
.use('/partidos',    partidoRouter)
.use('/liga',        ligaRouter)
.use('/pais',        paisRouter)
.use('/jugadores',   jugadorRouter)

// file upload
.use(fileUpload({ limits: { fileSize: 10000000 }, abortOnLimit: true }))
.use('/public', express.static('.public'))  // fetch files using http://<HOST>:<PORT>/public/<FILE_NAME>
.use('/upload/:foldername/:id', uploadFile)

// init
.listen(PORT, () => console.log(`> BetPoeli deployed on http://localhost:${PORT}`));

mongoose
.set('strictQuery',  false)
.connect(process.env.MONGO_CON_STRING!)
.then(() => console.log(`> mongoDB connection initialized.`))

