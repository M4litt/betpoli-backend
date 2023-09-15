import * as periodista                from '../middleware/auth.periodista.middleware'
import * as admin                     from '../middleware/auth.admin.middleware'
import { PeriodistaController }       from '../controllers/periodista.controller';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

export const PeriodistaRouter = express.Router();


PeriodistaRouter
.post('/register', bodyParser.json(), PeriodistaController.register)
.post('/login',    bodyParser.json(), PeriodistaController.login)

// -- authorization testing --
.get('/', (req:Request, res:Response) => {
    res.status(200).json({"holis": "sin auth"})
})
.get('/auth', periodista.auth, (req:Request, res:Response) => {
    res.status(200).json({"holis": "con periodista auth"})
})
.get('/admin_auth', admin.auth, (req:Request, res:Response) => {
    res.status(200).json({"holis": "con admin-auth"})
})