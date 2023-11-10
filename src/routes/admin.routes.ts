import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const AdminRouter = express.Router();

AdminRouter
.post  ('/register', AdminController.register)
.post  ('/login',    AdminController.login)
.get   ('/',         admin.auth , AdminController.getAll)
.get   ('/:id',      admin.auth , AdminController.getOne)
.delete('/:id',      admin.auth , AdminController.delete)
