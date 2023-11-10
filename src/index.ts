//* Deps
import express from "express"
import bodyParser from 'body-parser'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import fs from "fs"

//* Routers
import { periodistaRouter } from "./routes/periodista.routes"
import { equipoRouter }     from "./routes/equipo.routes"
import { AdminRouter }      from "./routes/admin.routes"
import { partidoRouter }    from "./routes/partido.routes"
import { ligaRouter }       from "./routes/liga.routes"
import { apostadorRouter } from "./routes/apostador.routes"

dotenv.config()

const app = express()
const API_PORT = process.env.API_PORT || 3000
const API_DOMAIN = process.env.API_DOMAIN || "localhost"
const API_PROTOCOL = process.env.API_PROTOCOL || "http"

const swaggerFile = (process.cwd()+"/swagger.json")
const swaggerData = fs.readFileSync(swaggerFile, 'utf8')
const swaggerDocument = JSON.parse(swaggerData)

app
  .use  (express.json())
  .use  (cors())

  .use  ('/api-doc',      swaggerUi.serve,  swaggerUi.setup       (swaggerDocument))
  .use  ('/periodistas',  periodistaRouter) .use('/journalists',  periodistaRouter)
  .use  ("/apostadores",  apostadorRouter)  .use("/gamblers",     apostadorRouter)
  .use  ('/partidos',     partidoRouter)    .use('/matches',      partidoRouter)
  .use  ('/equipos',      equipoRouter)     .use('/teams',        equipoRouter)
  .use  ('/ligas',        ligaRouter)       .use('/leagues',      ligaRouter)
  .use  ('/admin',        AdminRouter)

  // .use('/pais',        paisRouter)
  .listen(API_PORT, () => console.log(`> BetPoli deployed on ${API_PROTOCOL}://${API_DOMAIN}:${API_PORT}`))

mongoose
  .set("strictQuery",  false)
  .connect(process.env.DB_CON_STR!)
  .then(() => console.log(`> mongoDB connection initialized.`))
