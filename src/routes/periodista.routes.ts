import * as periodista                from '../middleware/auth.periodista.middleware'
import * as admin                     from '../middleware/auth.admin.middleware'
import { PeriodistaController }       from '../controllers/periodista.controller';
import { IPeriodista } from '../types/periodista.type';
import express, { Request, Response } from 'express';

export const PeriodistaRouter = express.Router();

PeriodistaRouter.post('/register', (req:Request, res:Response) => {
    const user: IPeriodista = req.body;
    PeriodistaController.register(user)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json({'message': err}))
});

PeriodistaRouter.post('/login', (req:Request, res:Response) => {
    const user: IPeriodista = req.body;
    PeriodistaController.login(user)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json({'message': err}))
});


// authorization testing
PeriodistaRouter.get('/', (req:Request, res:Response) => {
    res.status(200).json({"holis": "sin auth"})
})

PeriodistaRouter.get('/auth', periodista.auth, (req:Request, res:Response) => {
    res.status(200).json({"holis": "con periodista auth"})
})

PeriodistaRouter.get('/admin_auth', admin.auth, (req:Request, res:Response) => {
    res.status(200).json({"holis": "con admin-auth"})
})