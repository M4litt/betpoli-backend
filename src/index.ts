//* Deps
import express from "express"
import bodyParser from 'body-parser'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import fs from "fs"

//* Routers
import { rutasUsuarios }    from "./routes/user.routes"
import { PeriodistaRouter } from "./routes/periodista.routes"
import { equipoRouter }     from "./routes/equipo.routes"
import { AdminRouter }      from "./routes/admin.routes"
import { partidoRouter }    from "./routes/partido.routes"
import { rutasApuestas }    from './routes/apuesta.routes'
import { ligaRouter }       from "./routes/liga.routes"
import { paisRouter }       from "./routes/pais.routes"
import { eventRouter } from "./routes/event.routes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const swaggerFile = (process.cwd()+"/swagger.json")
const swaggerData = fs.readFileSync(swaggerFile, 'utf8')
const swaggerDocument = JSON.parse(swaggerData)

app
  .use(express.json())
  .use(cors({ origin: [`http://localhost:${PORT}`, `http://localhost:3000`], }))
  .get('', (req, res) => res.send("Bienvenido a mi api"))
  .use('/api-docs',    swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use("/apuestas",    rutasApuestas)
  .use("/usuarios",    rutasUsuarios)
  .use('/usuarios',    rutasUsuarios)
  .use('/periodistas', PeriodistaRouter)
  .use('/equipos',     equipoRouter)
  .use('/admin',       AdminRouter)
  .use('/partidos',    partidoRouter)
  .use('/partidos/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, undefined, undefined, undefined))
  .use('/liga',        ligaRouter)
  .use('/pais',        paisRouter)
  .use('/events',      eventRouter)
  .listen(PORT, () => console.log(`> BetPoeli deployed on http://localhost:${PORT}`))

mongoose
  .set("strictQuery",  false)
  .connect(process.env.DB_CON_STR!)
  .then(() => console.log(`> mongoDB connection initialized.`))
